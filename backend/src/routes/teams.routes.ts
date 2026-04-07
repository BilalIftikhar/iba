import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth.middleware';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_NLE68m1D_GWWiqbAtAMZMZmA5TXgd8BbA');

export const teamsRouter = Router();

// GET /api/v1/teams — Get team members for the authenticated user
teamsRouter.get('/', authenticate, async (req, res) => {
    try {
        if (!req.auth?.userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const teamMembers = await prisma.teamMember.findMany({
            where: { owner_user_id: req.auth.userId },
            include: {
                member: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        email: true
                    }
                }
            }
        });

        res.status(200).json({ success: true, data: teamMembers });
    } catch (error: any) {
        console.error('[GET /teams]', error);
        res.status(500).json({ error: 'Failed to fetch team members' });
    }
});

// POST /api/v1/teams — Invite a new team member
teamsRouter.post('/', authenticate, async (req, res) => {
    try {
        if (!req.auth?.userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { email, role } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // 1. Find or create dummy user for the invitee if they don't exist
        let member = await prisma.user.findUnique({ where: { email } });
        let generatedPassword = null;
        if (!member) {
            generatedPassword = crypto.randomBytes(4).toString('hex'); // 8 characters
            const password_hash = await bcrypt.hash(generatedPassword, 10);
            
            member = await prisma.user.create({
                data: {
                    email,
                    first_name: email.split('@')[0], // placeholder
                    last_name: '',
                    password_hash, 
                    hourly_rate: 0
                }
            });
        }

        // Check if already in team
        const existing = await prisma.teamMember.findUnique({
            where: {
                owner_user_id_member_user_id: {
                    owner_user_id: req.auth.userId,
                    member_user_id: member.id
                }
            }
        });

        if (existing) {
            return res.status(400).json({ error: 'User is already a team member' });
        }

        const newMember = await prisma.teamMember.create({
            data: {
                owner_user_id: req.auth.userId,
                member_user_id: member.id,
                role: role || 'viewer',
                invited_at: new Date()
            },
            include: {
                member: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        email: true
                    }
                }
            }
        });

        // 2. Automatically send an Invite Email to the new member so they know to log in
        try {
            await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
                to: email,
                subject: 'You have been invited to IBA Dashboard',
                html: `
                    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; color: #1E293B;">
                        <h2>Welcome to the team!</h2>
                        <p>You have been invited to collaborate on the IBA Dashboard as a <strong>${(role || 'viewer').toUpperCase()}</strong>.</p>
                        <br/>
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" style="background-color: #00C2FF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Log in to your Dashboard</a>
                        <br/><br/>
                        ${generatedPassword 
                            ? `<div style="background-color: #F8FAFC; padding: 16px; border-radius: 8px; border: 1px solid #E2E8F0;">
                                 <p style="margin-top: 0; font-size: 14px; color: #64748B;">Your temporary secure password is:</p>
                                 <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 0; color: #0f172a;">${generatedPassword}</p>
                               </div>
                               <p style="color: #64748B; font-size: 14px; margin-top: 16px;">Please log in with this password and navigate directly to your Settings page to change it.</p>`
                            : `<p style="color: #64748B; font-size: 14px;">Log in using your existing account credentials.</p>`
                        }
                    </div>
                `
            });
        } catch (err) {
            console.error('[POST /teams] Non-fatal error sending invite email:', err);
        }

        res.status(201).json({ success: true, data: newMember });
    } catch (error: any) {
        console.error('[POST /teams]', error);
        res.status(500).json({ error: 'Failed to add team member' });
    }
});

// DELETE /api/v1/teams/:id — Remove a team member
teamsRouter.delete('/:id', authenticate, async (req, res) => {
    try {
        if (!req.auth?.userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const memberId = req.params.id;

        // Ensure the team member belongs to the auth user
        const member = await prisma.teamMember.findFirst({
            where: { id: memberId, owner_user_id: req.auth.userId }
        });

        if (!member) {
            return res.status(404).json({ error: 'Team member not found' });
        }

        await prisma.teamMember.delete({
            where: { id: memberId }
        });

        res.status(200).json({ success: true, message: 'Team member removed' });
    } catch (error: any) {
        console.error('[DELETE /teams/:id]', error);
        res.status(500).json({ error: 'Failed to remove team member' });
    }
});

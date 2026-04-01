export function mockAiOptimize(text: string, fieldType: 'useCase' | 'problem' | 'outcome' | 'tools' | 'architecture'): string {
    const t = text.trim();
    if (!t || t.toLowerCase().startsWith('optimized:')) return text; // already optimized or empty
    
    switch (fieldType) {
        case 'useCase':
            return `Optimized: End-to-end automation for "${t}" leveraging AI-driven classification, with proactive monitoring, zero-downtime scalability, and seamless multi-channel deployment.`;
        case 'problem':
            return `Optimized: ${t}. This bottleneck causes measurable efficiency drain and data silos; the solution must resolve root-cause latency while preserving strict data integrity.`;
        case 'outcome':
            return `Optimized: ${t}. Success metrics include: 99.9% uptime, 40% reduction in manual overhead, real-time analytics dashboards, and scalable API architecture for future extensions.`;
        case 'tools':
            return `Optimized: ${t}. Recommend adopting event-driven webhooks, robust rate-limiting middleware, and specialized integration platforms (e.g. Make.com/Zapier) for resilient data pipelines.`;
        case 'architecture':
            return `Optimized: Enterprise-grade architecture for: "${t}". Must include separated micro-frontends/services, strict TypeScript typing, comprehensive automated testing, and automated CI/CD pipelines.`;
        default:
            return `Optimized: Refined requirement for "${t}" with enhanced security, modularity, and advanced error handling.`;
    }
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { fetchProfile, fetchUnreadCount, markNotificationsAsRead } from '../lib/api';

const PAGES_NAV = [
    {
        href: '/',
        label: 'Dashboard',
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.8203 4.17969V5.82031H12.5V4.17969H15.8203ZM7.5 4.17969V9.17969H4.17969V4.17969H7.5ZM15.8203 10.8203V15.8203H12.5V10.8203H15.8203ZM7.5 14.1797V15.8203H4.17969V14.1797H7.5ZM17.5 2.5H10.8203V7.5H17.5V2.5ZM9.17969 2.5H2.5V10.8203H9.17969V2.5ZM17.5 9.17969H10.8203V17.5H17.5V9.17969ZM9.17969 12.5H2.5V17.5H9.17969V12.5Z" fill="currentColor" />
            </svg>
        ),
    },
    {
        href: '/bookings',
        label: 'Bookings',
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.8203 5.82031H9.17969V9.17969H5.82031V10.8203H9.17969V14.1797H10.8203V10.8203H14.1797V9.17969H10.8203V5.82031ZM10 1.67969C5.39062 1.67969 1.67969 5.39062 1.67969 10C1.67969 14.6094 5.39062 18.3203 10 18.3203C14.6094 18.3203 18.3203 14.6094 18.3203 10C18.3203 5.39062 14.6094 1.67969 10 1.67969ZM10 16.6797C6.32812 16.6797 3.32031 13.6719 3.32031 10C3.32031 6.32812 6.32812 3.32031 10 3.32031C13.6719 3.32031 16.6797 6.32812 16.6797 10C16.6797 13.6719 13.6719 16.6797 10 16.6797Z" fill="currentColor" />
            </svg>
        ),
    },
    {
        href: '/history',
        label: 'History',
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.8203 2.5C6.67969 2.5 3.32031 5.85938 3.32031 10H0.820312L4.0625 13.2422L4.14062 13.3594L7.5 10H5C5 6.75781 7.61719 4.17969 10.8203 4.17969C14.0625 4.17969 16.6797 6.75781 16.6797 10C16.6797 13.2422 14.0625 15.8203 10.8203 15.8203C9.21875 15.8203 7.77344 15.1562 6.71875 14.1016L5.54688 15.3125C6.875 16.6406 8.75 17.5 10.8203 17.5C14.9609 17.5 18.3203 14.1406 18.3203 10C18.3203 5.85938 14.9609 2.5 10.8203 2.5ZM10 6.67969V10.8203L13.5547 12.9297L14.1797 11.875L11.25 10.1172V6.67969H10Z" fill="currentColor" />
            </svg>
        ),
    },
];

const AUTOMATE_NAV = [
    {
        href: '/automations',
        label: 'AI Automation & Agents',
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.02734 2.25C5.51918 2.25005 5.99101 2.44526 6.33887 2.79297C6.6868 3.1409 6.88281 3.61342 6.88281 4.10547C6.88276 4.59744 6.68675 5.06911 6.33887 5.41699C5.99099 5.76487 5.51932 5.96088 5.02734 5.96094C4.5353 5.96094 4.06277 5.76492 3.71484 5.41699C3.36714 5.06914 3.17193 4.59731 3.17188 4.10547C3.17188 3.61342 3.36691 3.1409 3.71484 2.79297C4.06277 2.44504 4.5353 2.25 5.02734 2.25Z" stroke="currentColor" strokeWidth="0.5" />
                <path d="M7.1324 4.10526C7.1324 4.66361 6.9106 5.1991 6.51578 5.59391C6.12097 5.98872 5.58549 6.21053 5.02714 6.21053C4.46879 6.21053 3.93331 5.98872 3.53849 5.59391C3.14368 5.1991 2.92188 4.66361 2.92188 4.10526C2.92188 3.54691 3.14368 3.01143 3.53849 2.61662C3.93331 2.2218 4.46879 2 5.02714 2C5.58549 2 6.12097 2.2218 6.51578 2.61662C6.9106 3.01143 7.1324 3.54691 7.1324 4.10526ZM7.1324 4.10526H11.764M11.764 4.10526L10.0798 2.42105M11.764 4.10526L10.0798 5.78947" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15.9746 14.0396C16.4664 14.0396 16.9383 14.2348 17.2861 14.5825C17.6341 14.9304 17.8301 15.403 17.8301 15.895C17.83 16.387 17.634 16.8587 17.2861 17.2065C16.9383 17.5544 16.4666 17.7504 15.9746 17.7505C15.4826 17.7505 15.01 17.5545 14.6621 17.2065C14.3144 16.8587 14.1192 16.3869 14.1191 15.895C14.1191 15.403 14.3142 14.9304 14.6621 14.5825C15.01 14.2346 15.4826 14.0396 15.9746 14.0396Z" stroke="currentColor" strokeWidth="0.5" />
                <path d="M13.8679 15.8948C13.8679 16.4532 14.0897 16.9886 14.4845 17.3835C14.8793 17.7783 15.4148 18.0001 15.9732 18.0001C16.5315 18.0001 17.067 17.7783 17.4618 17.3835C17.8566 16.9886 18.0784 16.4532 18.0784 15.8948C18.0784 15.3365 17.8566 14.801 17.4618 14.4062C17.067 14.0114 16.5315 13.7896 15.9732 13.7896C15.4148 13.7896 14.8793 14.0114 14.4845 14.4062C14.0897 14.801 13.8679 15.3365 13.8679 15.8948ZM13.8679 15.8948H9.23633M9.23633 15.8948L10.9205 14.2106M9.23633 15.8948L10.9205 17.579" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16.3945 2.67114C16.8864 2.6712 17.3582 2.86641 17.7061 3.21411C18.054 3.56204 18.25 4.03456 18.25 4.52661C18.25 4.77018 18.2016 5.01154 18.1084 5.23657C18.0152 5.4616 17.8783 5.6659 17.7061 5.83813C17.5338 6.01037 17.3295 6.14724 17.1045 6.24048C16.8795 6.33369 16.6381 6.38205 16.3945 6.38208C16.151 6.38208 15.9096 6.33366 15.6846 6.24048C15.4595 6.14724 15.2543 6.01041 15.082 5.83813C14.91 5.66599 14.7738 5.46142 14.6807 5.23657C14.5875 5.01154 14.5391 4.77018 14.5391 4.52661C14.5391 4.03456 14.7341 3.56204 15.082 3.21411C15.43 2.86618 15.9025 2.67114 16.3945 2.67114Z" stroke="currentColor" strokeWidth="0.5" />
                <path d="M16.3943 6.63167C15.836 6.63167 15.3005 6.40986 14.9057 6.01505C14.5109 5.62024 14.2891 5.08476 14.2891 4.52641C14.2891 3.96806 14.5109 3.43257 14.9057 3.03776C15.3005 2.64295 15.836 2.42114 16.3943 2.42114C16.9527 2.42114 17.4882 2.64295 17.883 3.03776C18.2778 3.43257 18.4996 3.96806 18.4996 4.52641C18.4996 5.08476 18.2778 5.62024 17.883 6.01505C17.4882 6.40986 16.9527 6.63167 16.3943 6.63167ZM16.3943 6.63167V11.2632M16.3943 11.2632L18.0785 9.57904M16.3943 11.2632L14.7101 9.57904" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4.60547 13.6184C5.09731 13.6185 5.56914 13.8137 5.91699 14.1614C6.26492 14.5093 6.46094 14.9818 6.46094 15.4739C6.46088 15.9658 6.26487 16.4375 5.91699 16.7854C5.56911 17.1333 5.09744 17.3293 4.60547 17.3293C4.11342 17.3293 3.6409 17.1333 3.29297 16.7854C2.94526 16.4375 2.75005 15.9657 2.75 15.4739C2.75 14.9818 2.94504 14.5093 3.29297 14.1614C3.6409 13.8134 4.11342 13.6184 4.60547 13.6184Z" stroke="currentColor" strokeWidth="0.5" />
                <path d="M4.60526 13.3684C4.04691 13.3684 3.51143 13.5902 3.11662 13.985C2.7218 14.3798 2.5 14.9153 2.5 15.4737C2.5 16.032 2.7218 16.5675 3.11662 16.9623C3.51143 17.3571 4.04691 17.5789 4.60526 17.5789C5.16361 17.5789 5.6991 17.3571 6.09391 16.9623C6.48872 16.5675 6.71053 16.032 6.71053 15.4737C6.71053 14.9153 6.48872 14.3798 6.09391 13.985C5.6991 13.5902 5.16361 13.3684 4.60526 13.3684ZM4.60526 13.3684V8.73682M4.60526 8.73682L6.28947 10.421M4.60526 8.73682L2.92105 10.421" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        href: '/ai-cowork',
        label: 'Ai Co-Work',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8c.5 3.5 3.5 6.5 7 7-3.5.5-6.5 3.5-7 7-.5-3.5-3.5-6.5-7-7 3.5-.5 6.5-3.5 7-7z" />
                <path d="M6 4c.4 2.5 2.5 4.6 5 5-2.5.4-4.6 2.5-5 5-.4-2.5-2.5-4.6-5-5 2.5-.4 4.6-2.5 5-5z" />
                <path d="M7 18c.3 1.2 1.2 2.1 2.5 2.5-1.3.4-2.2 1.3-2.5 2.5-.3-1.2-1.2-2.1-2.5-2.5 1.3-.4 2.2-1.3 2.5-2.5z" />
            </svg>
        ),
    },
    {
        href: '/ai-apps',
        label: 'Ai Custom Apps',
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.014 3.08308V2H16.5974V3.08308H15.6001V4.62154H16.5974V5.69231H18.014V4.62154H19V3.08308H18.014ZM15.6341 6.72615C14.6929 6.75877 13.7692 7.01061 12.9255 7.46462L12.7668 7.53846C12.6766 7.53846 12.5902 7.49956 12.5264 7.43032C12.4626 7.36107 12.4268 7.26716 12.4268 7.16923V3.53846C12.4269 3.13467 12.2807 2.74704 12.0199 2.45922C11.7592 2.1714 11.4046 2.00646 11.0329 2H3.41704C3.04133 2 2.681 2.16209 2.41533 2.4506C2.14966 2.73912 2.00041 3.13044 2.00041 3.53846V7.23077C1.9959 7.47688 2.03646 7.72152 2.11973 7.95047C2.203 8.17942 2.32732 8.38812 2.48548 8.56446C2.64364 8.7408 2.83248 8.88126 3.04103 8.97768C3.24959 9.0741 3.4737 9.12457 3.70037 9.12615C3.93557 9.12043 4.16711 9.06176 4.38035 8.95385C5.07409 8.52843 5.85094 8.28799 6.64696 8.25231C7.10028 8.22534 7.54508 8.39381 7.88464 8.72108C8.2242 9.04836 8.43106 9.50798 8.46025 10C8.43106 10.492 8.2242 10.9516 7.88464 11.2789C7.54508 11.6062 7.10028 11.7747 6.64696 11.7477C5.85094 11.712 5.07409 11.4716 4.38035 11.0462C4.16711 10.9382 3.93557 10.8796 3.70037 10.8738C3.24847 10.8771 2.8161 11.0743 2.49762 11.4225C2.17914 11.7707 2.0004 12.2415 2.00041 12.7323V16.4246C1.99587 16.6297 2.02917 16.8338 2.09833 17.0247C2.16749 17.2156 2.27111 17.3896 2.40312 17.5364C2.53512 17.6832 2.69282 17.7998 2.86695 17.8795C3.04108 17.9591 3.22811 18.0001 3.41704 18H11.0329C11.4086 18 11.7689 17.8379 12.0346 17.5494C12.3002 17.2609 12.4495 16.8696 12.4495 16.4615V12.8677C12.4448 12.8182 12.4494 12.7682 12.463 12.7207C12.4766 12.6732 12.4988 12.6291 12.5285 12.5912C12.5581 12.5533 12.5945 12.5222 12.6355 12.4999C12.6764 12.4777 12.7211 12.4646 12.7668 12.4615C12.8117 12.4516 12.8579 12.4516 12.9028 12.4615C13.7466 12.9155 14.6703 13.1674 15.6114 13.2C16.0293 13.2394 16.4501 13.184 16.8472 13.0374C17.2443 12.8907 17.609 12.656 17.9181 12.3482C18.2273 12.0403 18.4741 11.6661 18.6429 11.2491C18.8118 10.8322 18.899 10.3816 18.899 9.92615C18.899 9.47066 18.8118 9.02014 18.6429 8.60319C18.4741 8.18623 18.2273 7.81196 17.9181 7.50411C17.609 7.19627 17.2443 6.96158 16.8472 6.81494C16.4501 6.66831 16.0293 6.61292 15.6114 6.65231L15.6341 6.72615ZM17.0507 11.2308C16.8617 11.4228 16.6385 11.571 16.395 11.6662C16.1514 11.7615 15.8925 11.8017 15.6341 11.7846C14.8963 11.7489 14.1739 11.5433 13.5148 11.1815C13.2831 11.05 13.0279 10.9744 12.7668 10.96C12.3009 10.96 11.8541 11.161 11.5247 11.5188C11.1953 11.8765 11.0102 12.3617 11.0102 12.8677V16.4615H3.41704V12.7692C3.41985 12.6886 3.4506 12.6121 3.50313 12.555C3.55567 12.498 3.62612 12.4646 3.70037 12.4615H3.80236L4.04036 12.5723C4.84293 13.0382 5.73701 13.2872 6.64696 13.2985C7.47774 13.325 8.2843 12.9927 8.88978 12.3743C9.49526 11.756 9.85024 10.9021 9.87689 10C9.84731 9.10002 9.49105 8.24931 8.88589 7.63361C8.28073 7.01792 7.47584 6.68726 6.64696 6.71385C5.73701 6.72508 4.84293 6.97416 4.04036 7.44L3.80236 7.53846C3.76907 7.54906 3.73367 7.54906 3.70037 7.53846C3.6242 7.53528 3.55213 7.50016 3.4993 7.44049C3.44647 7.38082 3.41698 7.30124 3.41704 7.21846V3.52615H11.0329V7.13231C11.0328 7.63402 11.2148 8.11556 11.5393 8.47262C11.8639 8.82968 12.3049 9.03353 12.7668 9.04C13.0169 9.03751 13.2639 8.97884 13.4921 8.86769C14.1513 8.50591 14.8736 8.30035 15.6114 8.26462C15.8703 8.23749 16.1316 8.26827 16.3792 8.35506C16.6267 8.44185 16.8553 8.5828 17.0507 8.76923C17.3332 9.08604 17.4912 9.50976 17.4912 9.95077C17.4912 10.3918 17.3332 10.8155 17.0507 11.1323V11.2308Z" fill="currentColor" />
            </svg>
        ),
    },
    {
        href: '/ai-implementation',
        label: <>AI Implementation &<br />Transformation</>,
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.41667 12.8333V7.41667H12.8333V12.8333H7.41667ZM9.22222 11.0278H11.0278V9.22222H9.22222V11.0278ZM7.41667 18.25V16.4444H5.61111C5.11458 16.4444 4.68953 16.2677 4.33594 15.9141C3.98235 15.5605 3.80556 15.1354 3.80556 14.6389V12.8333H2V11.0278H3.80556V9.22222H2V7.41667H3.80556V5.61111C3.80556 5.11458 3.98235 4.68953 4.33594 4.33594C4.68953 3.98235 5.11458 3.80556 5.61111 3.80556H7.41667V2H9.22222V3.80556H11.0278V2H12.8333V3.80556H14.6389C15.1354 3.80556 15.5605 3.98235 15.9141 4.33594C16.2677 4.68953 16.4444 5.11458 16.4444 5.61111V7.41667H18.25V9.22222H16.4444V11.0278H18.25V12.8333H16.4444V14.6389C16.4444 15.1354 16.2677 15.5605 15.9141 15.9141C15.5605 16.2677 15.1354 16.4444 14.6389 16.4444H12.8333V18.25H11.0278V16.4444H9.22222V18.25H7.41667ZM14.6389 14.6389V5.61111H5.61111V14.6389H14.6389Z" fill="currentColor" />
            </svg>
        ),
    },
];

const SETTINGS_NAV = [
    {
        href: '/credentials',
        label: 'Credentials',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12.9524C11.5359 12.9524 11.0908 12.7818 10.7626 12.4782C10.4344 12.1745 10.25 11.7627 10.25 11.3333C10.25 10.4348 11.0287 9.7143 12 9.7143C12.4641 9.7143 12.9092 9.8849 13.2374 10.1885C13.5656 10.4921 13.75 10.9039 13.75 11.3333C13.75 11.7627 13.5656 12.1745 13.2374 12.4782C12.9092 12.7818 12.4641 12.9524 12 12.9524ZM17.25 15.381V7.2857H6.75V15.381H17.25ZM17.25 5.6667C17.7141 5.6667 18.1592 5.8372 18.4874 6.1409C18.8156 6.4445 19 6.8563 19 7.2857V15.381C19 15.8104 18.8156 16.2222 18.4874 16.5258C18.1592 16.8294 17.7141 17 17.25 17H6.75C6.2859 17 5.8408 16.8294 5.5126 16.5258C5.1844 16.2222 5 15.8104 5 15.381V7.2857C5 6.3871 5.7788 5.6667 6.75 5.6667H7.625V4.0476C7.625 2.9741 8.0859 1.9446 8.9064 1.1855C9.7269 0.4264 10.8397 0 12 0C12.5745 0 13.1434 0.1047 13.6742 0.3081C14.205 0.5115 14.6873 0.8097 15.0936 1.1855C15.4998 1.5614 15.8221 2.0076 16.042 2.4987C16.2618 2.9897 16.375 3.5161 16.375 4.0476V5.6667H17.25ZM12 1.619C11.3038 1.619 10.6361 1.8749 10.1438 2.3304C9.6516 2.7858 9.375 3.4035 9.375 4.0476V5.6667H14.625V4.0476C14.625 3.4035 14.3484 2.7858 13.8562 2.3304C13.3639 1.8749 12.6962 1.619 12 1.619Z" fill="currentColor" />
            </svg>
        ),
    },
    {
        href: '/subscription',
        label: 'Subscription',
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M4.249 9.99941C4.24875 8.78361 4.63383 7.599 5.34892 6.61573C6.06401 5.63245 7.07233 4.9011 8.22905 4.52671C9.38578 4.15232 10.6314 4.15415 11.787 4.53194C12.9426 4.90973 13.9488 5.64404 14.661 6.62941L14.146 7.14441C14.0759 7.21434 14.0281 7.30351 14.0088 7.40062C13.9894 7.49773 13.9993 7.5984 14.0372 7.68988C14.0751 7.78135 14.1394 7.8595 14.2217 7.91443C14.3041 7.96936 14.401 7.99859 14.5 7.99841H16.5C16.6326 7.99841 16.7598 7.94573 16.8536 7.85196C16.9473 7.7582 17 7.63102 17 7.49841V5.49841C17.0002 5.39939 16.9709 5.30255 16.916 5.22016C16.8611 5.13777 16.7829 5.07354 16.6915 5.03563C16.6 4.99771 16.4993 4.98781 16.4022 5.00717C16.3051 5.02654 16.2159 5.0743 16.146 5.14441L15.554 5.73741C14.6634 4.57746 13.4319 3.72553 12.0324 3.3012C10.6329 2.87686 9.13566 2.90143 7.75084 3.37146C6.36602 3.84149 5.16315 4.73337 4.31109 5.92192C3.45902 7.11046 3.00054 8.536 3 9.99841C3 10.1642 3.06585 10.3231 3.18306 10.4404C3.30027 10.5576 3.45924 10.6234 3.625 10.6234C3.79076 10.6234 3.94973 10.5576 4.06694 10.4404C4.18415 10.3231 4.25 10.1642 4.25 9.99841M10 5.87341C10.345 5.87341 10.625 6.15341 10.625 6.49841V7.05541C10.9525 7.09886 11.2616 7.23209 11.518 7.44036C11.7745 7.64862 11.9683 7.9238 12.078 8.23541C12.1086 8.31349 12.1231 8.39691 12.1207 8.48072C12.1184 8.56453 12.0992 8.64701 12.0643 8.72325C12.0294 8.79949 11.9796 8.86793 11.9177 8.9245C11.8558 8.98107 11.7832 9.0246 11.7041 9.05252C11.625 9.08044 11.5412 9.09217 11.4575 9.087C11.3738 9.08184 11.292 9.05989 11.217 9.02247C11.142 8.98504 11.0752 8.93291 11.0208 8.86916C10.9663 8.80541 10.9252 8.73136 10.9 8.65141C10.8628 8.54564 10.7937 8.45405 10.7021 8.38937C10.6105 8.32468 10.5011 8.29009 10.389 8.29041H9.486C9.38281 8.28941 9.28293 8.3268 9.20577 8.39532C9.1286 8.46383 9.07966 8.55859 9.06844 8.66117C9.05722 8.76375 9.08453 8.86684 9.14506 8.95042C9.2056 9.03399 9.29503 9.09208 9.396 9.11341L10.772 9.41341C11.1845 9.50293 11.5521 9.73516 11.8101 10.0692C12.0681 10.4032 12.1999 10.8175 12.1823 11.2392C12.1648 11.6609 11.9989 12.0629 11.714 12.3743C11.4291 12.6857 11.0435 12.8865 10.625 12.9414V13.4984C10.625 13.6642 10.5592 13.8231 10.4419 13.9404C10.3247 14.0576 10.1658 14.1234 10 14.1234C9.83424 14.1234 9.67527 14.0576 9.55806 13.9404C9.44085 13.8231 9.375 13.6642 9.375 13.4984V12.9414C9.0475 12.898 8.73842 12.7647 8.48197 12.5565C8.22552 12.3482 8.03171 12.073 7.922 11.7614C7.89144 11.6833 7.87691 11.5999 7.87926 11.5161C7.88161 11.4323 7.9008 11.3498 7.93569 11.2736C7.97057 11.1973 8.02044 11.1289 8.08233 11.0723C8.14421 11.0158 8.21684 10.9722 8.2959 10.9443C8.37496 10.9164 8.45882 10.9047 8.5425 10.9098C8.62619 10.915 8.70797 10.9369 8.783 10.9744C8.85803 11.0118 8.92475 11.0639 8.97921 11.1277C9.03367 11.1914 9.07475 11.2655 9.1 11.3454C9.13716 11.4512 9.20633 11.5428 9.29789 11.6075C9.38946 11.6721 9.49889 11.7067 9.611 11.7064H10.389C10.5223 11.7059 10.6507 11.6563 10.7498 11.5671C10.8488 11.4779 10.9115 11.3553 10.9259 11.2228C10.9402 11.0903 10.9052 10.9571 10.8276 10.8487C10.75 10.7404 10.6351 10.6644 10.505 10.6354L9.13 10.3344C8.73784 10.2488 8.38978 10.0245 8.14982 9.70269C7.90987 9.38091 7.79415 8.98332 7.82396 8.58303C7.85377 8.18274 8.0271 7.80667 8.31207 7.52399C8.59703 7.2413 8.97448 7.071 9.375 7.04441V6.49841C9.375 6.15341 9.655 5.87341 10 5.87341ZM3.309 14.9604C3.21756 14.9226 3.1394 14.8585 3.08439 14.7763C3.02939 14.6941 3.00002 14.5974 3 14.4984V12.4984C3 12.3658 3.05268 12.2386 3.14645 12.1449C3.24021 12.0511 3.36739 11.9984 3.5 11.9984H5.5C5.59902 11.9982 5.69586 12.0275 5.77825 12.0824C5.86064 12.1373 5.92487 12.2155 5.96278 12.3069C6.0007 12.3984 6.0106 12.4991 5.99124 12.5962C5.97187 12.6933 5.92411 12.7825 5.854 12.8524L5.339 13.3664C6.0512 14.3518 7.05736 15.0861 8.21298 15.4639C9.3686 15.8417 10.6142 15.8435 11.7709 15.4691C12.9277 15.0947 13.936 14.3634 14.6511 13.3801C15.3662 12.3968 15.7512 11.2122 15.751 9.99641C15.7511 9.91434 15.7673 9.83308 15.7988 9.75727C15.8302 9.68147 15.8763 9.61261 15.9344 9.55462C15.9925 9.49663 16.0614 9.45064 16.1373 9.4193C16.2131 9.38795 16.2944 9.37185 16.3765 9.37191C16.4586 9.37198 16.5398 9.38821 16.6156 9.41968C16.6914 9.45115 16.7603 9.49724 16.8183 9.55532C16.8763 9.61341 16.9223 9.68234 16.9536 9.7582C16.985 9.83405 17.0011 9.91534 17.001 9.99741C17.0009 11.4602 16.5427 12.8862 15.6907 14.0751C14.8386 15.2641 13.6356 16.1564 12.2505 16.6266C10.8654 17.0968 9.36774 17.1213 7.96796 16.6967C6.56818 16.2722 5.33654 15.4198 4.446 14.2594L3.854 14.8524C3.78402 14.9223 3.69489 14.9699 3.59788 14.9891C3.50087 15.0083 3.40034 14.9983 3.309 14.9604Z" fill="currentColor" />
            </svg>
        ),
    },
    {
        href: '/settings',
        label: 'Settings',
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.2107 10.8203C16.2107 10.5469 16.2498 10.2734 16.2498 10C16.2498 9.72656 16.2107 9.45312 16.2107 9.17969L17.9685 7.8125C18.1248 7.69531 18.1638 7.46094 18.0467 7.26562L16.367 4.375C16.2888 4.25781 16.1717 4.17969 16.0154 4.17969C15.9763 4.17969 15.8982 4.17969 15.8592 4.21875L13.7888 5.03906C13.3592 4.72656 12.8904 4.41406 12.3826 4.21875L12.0701 2.03125C12.031 1.83594 11.8748 1.67969 11.6795 1.67969H8.32009C8.12478 1.67969 7.96853 1.83594 7.92947 2.03125L7.61697 4.21875C7.10915 4.41406 6.6404 4.72656 6.21072 5.03906L4.1404 4.21875C4.06228 4.17969 4.02322 4.17969 3.98415 4.17969C3.8279 4.17969 3.71072 4.25781 3.63259 4.375L1.9529 7.26562C1.83572 7.46094 1.87478 7.69531 2.03103 7.8125L3.78884 9.17969C3.78884 9.45312 3.74978 9.72656 3.74978 10C3.74978 10.2734 3.78884 10.5469 3.78884 10.8203L2.03103 12.1875C1.87478 12.3047 1.83572 12.5391 1.9529 12.7344L3.63259 15.625C3.71072 15.7422 3.8279 15.8203 3.98415 15.8203C4.02322 15.8203 4.10134 15.8203 4.1404 15.7812L6.21072 14.9609C6.6404 15.2734 7.10915 15.5859 7.61697 15.7812L7.92947 17.9688C7.96853 18.1641 8.12478 18.3203 8.32009 18.3203H11.6795C11.8748 18.3203 12.031 18.1641 12.0701 17.9688L12.3826 15.7812C12.8904 15.5859 13.3592 15.2734 13.7888 14.9609L15.8592 15.7812C15.9373 15.8203 15.9763 15.8203 16.0154 15.8203C16.1717 15.8203 16.2888 15.7422 16.367 15.625L18.0467 12.7344C18.1638 12.5391 18.1248 12.3047 17.9685 12.1875L16.2107 10.8203ZM14.531 9.375C14.5701 9.64844 14.5701 9.84375 14.5701 10C14.5701 10.1562 14.5701 10.3516 14.531 10.625L14.4138 11.5625L15.156 12.1484L16.0545 12.8516L15.4685 13.8281L14.4138 13.3984L13.5545 13.0859L12.8123 13.6328C12.4607 13.9062 12.1092 14.1016 11.7576 14.2578L10.8982 14.6094L10.742 15.5469L10.5857 16.6797H9.41384L9.25759 15.5469L9.1404 14.6094L8.24197 14.2578C7.8904 14.1016 7.53884 13.9062 7.22634 13.6328L6.44509 13.0859L5.58572 13.4375L4.53103 13.8672L3.94509 12.8516L4.84353 12.1484L5.58572 11.5625L5.46853 10.625C5.42947 10.3516 5.42947 10.1562 5.42947 10C5.42947 9.84375 5.42947 9.64844 5.46853 9.375L5.58572 8.4375L4.84353 7.85156L3.94509 7.14844L4.53103 6.17188L5.58572 6.60156L6.44509 6.91406L7.18728 6.36719C7.53884 6.09375 7.8904 5.89844 8.24197 5.74219L9.10134 5.39062L9.25759 4.45312L9.41384 3.32031H10.5857L10.742 4.45312L10.8592 5.39062L11.7576 5.74219C12.1092 5.89844 12.4607 6.09375 12.7732 6.36719L13.5154 6.91406L14.4138 6.5625L15.4685 6.13281L16.0545 7.14844L15.156 7.85156L14.4138 8.4375L14.531 9.375ZM9.99978 6.67969C8.16384 6.67969 6.67947 8.16406 6.67947 10C6.67947 11.8359 8.16384 13.3203 9.99978 13.3203C11.8357 13.3203 13.3201 11.8359 13.3201 10C13.3201 8.16406 11.8357 6.67969 9.99978 6.67969ZM9.99978 11.6797C9.10134 11.6797 8.32009 10.8984 8.32009 10C8.32009 9.10156 9.10134 8.32031 9.99978 8.32031C10.8982 8.32031 11.6795 9.10156 11.6795 10C11.6795 10.8984 10.8982 11.6797 9.99978 11.6797Z" fill="currentColor" />
            </svg>
        ),
    },
];

function NavItem({ href, label, icon, onClick }: { href: string; label: React.ReactNode; icon: React.ReactNode; onClick?: () => void }) {
    const pathname = usePathname();
    const active = pathname === href || (href !== '/' && pathname.startsWith(href));

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`
        flex items-center gap-3 px-3 py-2.5 rounded-l-none rounded-r-2xl text-[13.5px] font-medium transition-all duration-150
        ${active
                    ? 'bg-gradient-to-r from-[#e7f6ff] to-[#ccf2ff] text-[#00c2ff] font-semibold'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }
      `}
        >
            <span className={`flex-shrink-0 ${active ? 'text-[#00c2ff]' : 'text-slate-400'}`}>{icon}</span>
            <span className="truncate-multiline leading-tight">{label}</span>
        </Link>
    );
}

import { NotificationModal } from './NotificationModal';

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [profile, setProfile] = useState<{ first_name: string; last_name: string; email: string } | null>(null);
    const [unreadNotifications, setUnreadNotifications] = useState(0);

    const loadUnreadCount = async () => {
        try {
            const data = await fetchUnreadCount();
            setUnreadNotifications(data.count);
        } catch (e) { }
    };

    useEffect(() => {
        fetchProfile().then(data => setProfile(data)).catch(() => { });
        loadUnreadCount();
    }, []);

    useEffect(() => {
        const socket = (window as any).socket;
        if (!socket) return;
        
        const handleNewNotif = () => setUnreadNotifications(prev => prev + 1);
        socket.on('client:new_notification', handleNewNotif);
        return () => socket.off('client:new_notification', handleNewNotif);
    }, []);

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        localStorage.removeItem('access_token');
        window.location.href = '/login';
    };

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <>
            {/* Mobile Top Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-[60px] bg-white border-b border-slate-100 flex items-center justify-between px-4 z-40">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="p-2 -ml-2 text-slate-500 hover:text-slate-800 focus:outline-none"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                    <div className="flex items-baseline gap-0.5">
                        <span className="text-xl font-black text-slate-800 tracking-tight">IBA</span>
                        <span className="text-xl font-black text-blue-500">.</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsModalOpen(true)} className="text-slate-400 hover:text-slate-600 transition-colors relative">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        {unreadNotifications > 0 && (
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                        )}
                    </button>
                    <div className="relative">
                        <button onClick={() => { setIsOpen(false); setIsProfileOpen(!isProfileOpen); }} className="block focus:outline-none">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={profile ? `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.first_name)}+${encodeURIComponent(profile.last_name)}&background=e0f2fe&color=0284c7&bold=true` : "https://ui-avatars.com/api/?name=User&background=e0f2fe&color=0284c7&bold=true"}
                                alt="User Profile"
                                className="w-8 h-8 rounded-full border border-slate-200 shadow-sm"
                            />
                        </button>
                        {isProfileOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                                <div className="absolute top-[44px] right-0 z-50 w-[224px] bg-white rounded-2xl shadow-[0_25px_50px_-12px_rgba(22,78,99,0.1)] p-1.5 flex flex-col gap-0.5 border border-slate-100">
                                    <Link href="/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors group">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-slate-600">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                                        </svg>
                                        <span className="text-[13px] font-medium text-slate-600 group-hover:text-slate-800">Profile Settings</span>
                                    </Link>
                                    <Link href="/subscription" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors group">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-slate-600">
                                            <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                                        </svg>
                                        <span className="text-[13px] font-medium text-slate-600 group-hover:text-slate-800">Billing</span>
                                    </Link>
                                    <div className="h-[1px] bg-slate-100 my-1 mx-2" />
                                    <button onClick={handleLogout} className="flex items-center gap-2.5 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors w-full text-left group">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                                        </svg>
                                        <span className="text-[13px] font-medium text-red-600">Logout</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <NotificationModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onRead={() => setUnreadNotifications(0)}
            />

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Main Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 flex flex-col w-[260px] bg-white border-r border-slate-100 shadow-sm 
                transition-transform duration-300 ease-in-out
                lg:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Logo & Close Button */}
                <div className="px-6 pt-6 pb-4 relative">
                    <div>
                        <div className="flex items-baseline gap-0.5">
                            <span className="text-2xl font-black text-slate-800 tracking-tight">IBA</span>
                            <span className="text-2xl font-black text-blue-500">.</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-medium tracking-wide">Intelligent Business Automation</p>
                    </div>
                    <button
                        className="lg:hidden absolute top-6 right-5 p-1 text-slate-400 hover:text-slate-600 focus:outline-none"
                        onClick={() => setIsOpen(false)}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
                    {/* Pages */}
                    <p className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Pages</p>
                    {PAGES_NAV.map((item) => <NavItem key={item.href} {...item} onClick={() => setIsOpen(false)} />)}

                    {/* Automate */}
                    <p className="px-3 pt-5 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Automate</p>
                    {AUTOMATE_NAV.map((item) => <NavItem key={item.href} {...item} onClick={() => setIsOpen(false)} />)}

                    {/* Settings */}
                    <p className="px-3 pt-5 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Settings</p>
                    {SETTINGS_NAV.map((item) => <NavItem key={item.href} {...item} onClick={() => setIsOpen(false)} />)}
                </nav>

                {/* User profile */}
                <div className="px-4 py-4 mt-auto border-t border-slate-100 lg:border-t-0 relative">
                    <button onClick={() => { setIsOpen(false); setIsProfileOpen(!isProfileOpen); }} className="flex items-center gap-3 hover:bg-slate-50 p-2 -mx-2 rounded-xl transition-colors cursor-pointer w-full text-left focus:outline-none">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={profile ? `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.first_name)}+${encodeURIComponent(profile.last_name)}&background=e0f2fe&color=0284c7&bold=true` : "https://ui-avatars.com/api/?name=User&background=e0f2fe&color=0284c7&bold=true"}
                            alt="User Profile"
                            className="w-8 h-8 rounded-full border border-slate-200 shadow-sm shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-semibold text-slate-800 truncate">{profile ? `${profile.first_name} ${profile.last_name}` : 'Loading...'}</p>
                            <p className="text-[11px] text-slate-400 truncate">{profile ? profile.email : ''}</p>
                        </div>
                    </button>
                    {isProfileOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                            <div className="absolute bottom-[72px] left-[16px] z-50 w-[224px] bg-white rounded-2xl shadow-[0_25px_50px_-12px_rgba(22,78,99,0.1)] p-1.5 flex flex-col gap-0.5 border border-slate-100">
                                <Link href="/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors group">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-slate-600">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                                    </svg>
                                    <span className="text-[13px] font-medium text-slate-600 group-hover:text-slate-800">Profile Settings</span>
                                </Link>
                                <Link href="/subscription" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors group">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-slate-600">
                                        <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                                    </svg>
                                    <span className="text-[13px] font-medium text-slate-600 group-hover:text-slate-800">Billing</span>
                                </Link>
                                <div className="h-[1px] bg-slate-100 my-1 mx-2" />
                                <button onClick={handleLogout} className="flex items-center gap-2.5 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors w-full text-left group">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                                    </svg>
                                    <span className="text-[13px] font-medium text-red-600">Logout</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </aside>
        </>
    );
}

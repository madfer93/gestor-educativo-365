"use client";

import { usePathname } from 'next/navigation';

export default function NavbarWrapper({ children, slug }) {
    const pathname = usePathname();

    // Lista de prefijos de rutas donde NO queremos mostrar el SchoolNavbar
    const hiddenRoutes = [
        `/${slug}/admin`,
        `/${slug}/estudiante`,
        `/${slug}/profesores`,
        `/${slug}/secretaria`,
        `/${slug}/tesoreria`,
        `/${slug}/coordinacion`,
    ];

    const shouldHide = hiddenRoutes.some(route => pathname.startsWith(route));

    if (shouldHide) return null;

    return <>{children}</>;
}

export const MembershipPackages = [
    'individual',
    'family',
    'organization_business',
] as const

export type MembershipPackage = (typeof MembershipPackages)[number]
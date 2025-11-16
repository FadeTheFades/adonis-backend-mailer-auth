export const ResourceKeys = [
    'land_management_services',
    'estate_planning_heirs_property',
    'succession_planning_assistance',
    'regenerative_agriculture_resources',
    'education_training_workshops',
    'networking_community',
] as const

export type ResourceKey = (typeof ResourceKeys)[number]
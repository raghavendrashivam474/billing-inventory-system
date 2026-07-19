// Storage Location Constants — Sprint 4.1
export const STORAGE_LOCATION_ERRORS = {
  NOT_FOUND:          'Storage location not found.',
  CODE_ALREADY_EXISTS: 'Storage location code already exists in this warehouse.',
  WAREHOUSE_INACTIVE: 'Cannot create storage location for an inactive warehouse.',
  LOCATION_INACTIVE:  'Storage location is inactive.',
} as const;

export const STORAGE_LOCATION_MESSAGES = {
  CREATED:  'Storage location created successfully.',
  UPDATED:  'Storage location updated successfully.',
  DELETED:  'Storage location deactivated successfully.',
  RESTORED: 'Storage location restored successfully.',
} as const;
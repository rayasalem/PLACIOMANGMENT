
# Placio Database Documentation

## Tables Description

### 1. `roles`
- **Goal**: Manages platform access levels.
- **Constraints**: `name` must be unique.

### 2. `users`
- **Goal**: The primary table for authentication.
- **SaaS Logic**: Every user belongs to a `tenant_id`. In a multi-tenant environment, this ID identifies the isolated data silo.
- **Security**: Uses `UUID` to prevent ID enumeration.

### 3. `profiles`
- **Goal**: One-to-One relationship with `users`. Contains all metadata about the store.
- **Flexibility**: Uses `JSONB` for `social_links` to allow merchants to add any number of platforms without schema changes.

### 4. `products`
- **Goal**: Stores the inventory.
- **Constraints**: `price` must be non-negative.
- **Optimization**: `tenant_id` is indexed for high-speed retrieval of a specific store's products.

### 5. `admin_logs`
- **Goal**: Internal governance.
- **Audit**: Tracks who did what, when, and to whom.

## Relationships
- `users` -> `roles`: Many-to-One.
- `users` -> `profiles`: One-to-One.
- `users` -> `products`: One-to-Many.
- `users` -> `admin_logs`: One-to-Many.

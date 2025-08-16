# PTW-Next Application Documentation

## User Roles and Authorization System

### Overview

PTW-Next implements a dual-role system with two distinct role fields for flexible authorization:

- **Role**: Core authentication roles used by better-auth
- **AppRole**: Application-specific roles for feature access

### Role vs AppRole

#### Role (Core Authentication)
The `role` field is used by better-auth for basic system-level permissions:

- **admin**: Full system administrator access
- **user**: Standard authenticated user

#### AppRole (Application Features)
The `appRole` field determines specific application functionality access:

- **admin**: Administrative portal access
- **trainer**: Trainer portal access and contact management
- **parent**: Parent-specific features and dashboards
- **player**: Player-specific features and dashboards

### Role Combinations and Access Patterns

#### Admin Users
- **Role**: `admin`
- **AppRole**: Typically `admin`
- **Access**: Complete system access including:
  - Admin portal (`/admin/*`)
  - User management and role assignments
  - All API endpoints
  - System configuration

#### Trainer Users
- **Role**: `user`
- **AppRole**: `trainer`
- **Access**: Trainer-specific features including:
  - Trainer portal (`/trainer/*`)
  - Contact management (create, read, update, delete contacts)
  - Training plan management
  - Limited to their own data scope

#### Parent Users
- **Role**: `user`
- **AppRole**: `parent`
- **Access**: Parent-specific features including:
  - Parent dashboard
  - View their player's information
  - Communication with trainers
  - Schedule management

#### Player Users
- **Role**: `user`
- **AppRole**: `player`
- **Access**: Player-specific features including:
  - Player dashboard
  - Training progress tracking
  - Performance metrics
  - Schedule viewing

### Authorization Implementation

#### Middleware Protection
Routes are protected based on both role types:
- `/admin/*` - Requires `role: "admin"`
- `/trainer/*` - Requires `appRole: "trainer"`
- Dashboard access varies by `appRole`

#### API Endpoint Security
API routes implement role-based checks:
- Admin endpoints: `session.user.role === "admin"`
- Trainer endpoints: `session.user.appRole === "trainer"`
- Data isolation: Users can only access their own data unless admin

#### Flexible Authorization
The dual-role system allows for:
- Admin users with trainer capabilities (`role: "admin"`, `appRole: "trainer"`)
- Emergency admin access to any portal
- Fine-grained permission control
- Easy role transitions without losing authentication status

### User Onboarding

#### Invite System
New admin and trainer users are onboarded via email invites:
1. Admin creates invite with specific role
2. Invited user receives email with signup link
3. User completes registration with pre-assigned roles
4. Automatic role assignment based on invite type

#### Self-Registration
Parent and player users can self-register:
- Default `role: "user"`
- Choose appropriate `appRole` during signup
- May require trainer approval for certain features
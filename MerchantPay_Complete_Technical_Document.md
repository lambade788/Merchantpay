# 🏦 MerchantPay — Complete Technical Interview Document
### Fresher Software Trainee Interview Preparation
> Every section is based on actual source code. Nothing is assumed.

---

# SECTION 1 — PROJECT OVERVIEW

## Project Name
**MerchantPay**

## Objective
MerchantPay is a full-stack web application that acts as a **mini payment gateway** for merchants. It allows merchants to register, create payment links and QR codes, and receive payments from customers — all tracked in a real-time dashboard.

## Problem It Solves
Small businesses and freelancers often need a simple way to collect payments without signing up for complex payment gateways. MerchantPay solves this by letting a merchant:
1. Register an account
2. Create a payment link in seconds
3. Share the link or QR code with a customer
4. Customer pays directly through the link
5. Merchant sees the transaction instantly in their dashboard

## Target Users
- Small business owners
- Freelancers
- Shop owners who want a quick payment collection solution

## Main Features
1. Merchant registration and login with JWT
2. Create shareable payment links (UUID-based)
3. QR code generation (backend-rendered PNG)
4. Public payment page (UPI / Card selection)
5. Real-time transaction recording
6. Dashboard with revenue, success rate, and stats
7. Product inventory management (add/edit products)
8. Marketplace shop for customers to browse and add to cart
9. Cart and checkout flow (creates order + payment link)
10. Order history tracking
11. Analytics page with charts
12. Demo Mode (no backend required — uses localStorage)

---

# SECTION 2 — TECHNOLOGY STACK

## Frontend
| Item | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 7 |
| CSS Framework | Tailwind CSS v3 |
| Routing | React Router DOM v7 |
| Charts | Recharts |
| Icons | Lucide React |
| QR Code | qrcode.react |
| Animations | Framer Motion (installed, partially used) |
| HTTP Client | Fetch API + Axios |

## Backend
| Item | Technology |
|---|---|
| Framework | Spring Boot 3.3.5 |
| Language | Java 17 |
| Security | Spring Security |
| ORM | Spring Data JPA (Hibernate) |
| Password Encoding | BCryptPasswordEncoder |
| JWT Library | jjwt (io.jsonwebtoken) v0.11.5 |
| QR Code | Google ZXing 3.5.3 |
| Validation | Spring Boot Starter Validation |
| Build Tool | Maven |
| Boilerplate Reducer | Lombok (optional, configured) |
| Payment SDK | Razorpay Java SDK v1.4.3 (dependency present, not fully wired) |

## Database
- **MySQL** (local, port 3306)
- Database name: `merchantpay`
- Hibernate auto DDL: `update` (auto creates/updates tables)

## Authentication
- **JWT (JSON Web Token)** using HMAC-SHA256 algorithm
- Token expiry: 24 hours
- Stored in browser `localStorage`

## Deployment
**Not implemented** — runs locally:
- Backend: `http://localhost:8080`
- Frontend: `http://localhost:5173`

---

# SECTION 3 — COMPLETE FOLDER STRUCTURE

## Frontend Folder Structure
```
merchantpay-frontend/
├── public/                    # Static assets served as-is
├── src/
│   ├── api/                   # All API call functions (separated by domain)
│   │   ├── authApi.js         # Register, Login, Logout using Fetch API
│   │   ├── paymentApi.js      # Payment links, transactions, pay, demo mode
│   │   └── analyticsApi.js    # Dashboard stats and analytics (not fully connected)
│   ├── assets/                # Images and static files
│   ├── components/            # Reusable UI components
│   │   ├── DashboardNavbar.jsx  # Top navbar for dashboard with hamburger button
│   │   ├── Features.jsx         # Landing page features section
│   │   ├── Footer.jsx           # Site footer
│   │   ├── Hero.jsx             # Landing page hero section
│   │   ├── Navbar.jsx           # Public navigation bar
│   │   ├── Pricing.jsx          # Landing page pricing section
│   │   └── Sidebar.jsx          # Collapsible left sidebar navigation
│   ├── context/               # React Context providers (global state)
│   │   ├── AuthContext.jsx      # JWT token, user, login/logout functions
│   │   ├── CartContext.jsx      # Cart items, addToCart, removeFromCart
│   │   └── RealtimeContext.jsx  # Placeholder for SSE/WebSocket (not active)
│   ├── hooks/                 # Custom React Hooks
│   │   ├── useAuth.js           # Wraps AuthContext + adds redirect on login/logout
│   │   └── useSEE.JS            # Duplicate of useAuth.js (same content)
│   ├── layouts/               # Page layout wrappers
│   │   └── DashboardLayout.jsx  # Shell: Sidebar + Navbar + <Outlet />
│   ├── pages/                 # Full-page components (mapped to routes)
│   │   ├── Landing.jsx          # Public home page
│   │   ├── Login.jsx            # Login form page
│   │   ├── Register.jsx         # Registration form with client-side validation
│   │   ├── Demo.jsx             # Demo page
│   │   ├── PaymentPage.jsx      # Public customer payment page (/pay/:linkId)
│   │   └── dashboard/           # All authenticated dashboard pages
│   │       ├── Overview.jsx       # Dashboard home: stats, chart, recent txns
│   │       ├── Transactions.jsx   # All transactions with filter and search
│   │       ├── PaymentLink.jsx    # Create payment link + show QR code
│   │       ├── Analytics.jsx      # Analytics charts and summary
│   │       ├── Orders.jsx         # Order history table
│   │       ├── Shop.jsx           # Product marketplace (browse + add to cart)
│   │       ├── Cart.jsx           # Cart page with checkout
│   │       ├── Merchant.jsx       # Inventory management (add/edit products)
│   │       └── Settings.jsx       # Settings page (UI only, no functionality)
│   ├── utils/                 # Utility/helper functions
│   │   ├── constants.js         # API base URL and endpoint constants
│   │   └── formatters.js        # formatCurrency, formatDate, getStatusColor
│   ├── App.jsx                # Root component: defines all Routes
│   ├── main.jsx               # Entry point: renders App into DOM
│   ├── App.css                # Minimal global CSS
│   └── index.css              # Main CSS file: Tailwind directives + custom classes
├── index.html                 # HTML shell (Vite entry)
├── package.json               # Dependencies and scripts
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind theme customization
└── postcss.config.js          # PostCSS config (for Tailwind)
```

## Backend Folder Structure
```
merchantpay/merchantpay/
├── src/
│   ├── main/
│   │   ├── java/com/merchantpay/app/
│   │   │   ├── MerchantpayBackendApplication.java  # Entry point (@SpringBootApplication)
│   │   │   ├── config/
│   │   │   │   ├── SecurityConfig.java    # Spring Security filter chain, CORS config
│   │   │   │   └── PasswordConfig.java    # BCryptPasswordEncoder @Bean
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java         # /api/auth/register, /api/auth/login
│   │   │   │   ├── PaymentController.java       # /api/pay/{linkId}, /api/payment-links, /api/pay/{linkId}/qr
│   │   │   │   ├── PaymentLinkController.java   # /api/payment-links CRUD + QR
│   │   │   │   ├── ProductController.java       # /api/products CRUD
│   │   │   │   ├── DashboardController.java     # /api/dashboard/summary, /recent-transactions
│   │   │   │   ├── OrderController.java         # /api/orders
│   │   │   │   ├── CheckoutController.java      # /api/checkout
│   │   │   │   └── TransactionController.java   # /api/transactions
│   │   │   ├── service/
│   │   │   │   ├── AuthService.java         # Registration, Login, JWT generation
│   │   │   │   ├── PaymentLinkService.java  # Create link, process payment, get transactions
│   │   │   │   ├── CheckoutService.java     # Stock validation, order creation, payment link
│   │   │   │   └── QrCodeService.java       # ZXing QR code PNG generation
│   │   │   ├── repository/
│   │   │   │   ├── UserRepository.java           # findByEmail()
│   │   │   │   ├── ProductRepository.java         # Standard CRUD
│   │   │   │   ├── OrderRepository.java           # findByPaymentLinkId()
│   │   │   │   ├── OrderItemRepository.java       # Standard CRUD
│   │   │   │   ├── PaymentLinkRepository.java     # findByLinkId(), findAll()
│   │   │   │   └── TransactionRepository.java     # findAllByOrderByPaidAtDesc()
│   │   │   ├── entity/
│   │   │   │   ├── User.java          # @Entity → users table
│   │   │   │   ├── Product.java       # @Entity → product table
│   │   │   │   ├── Order.java         # @Entity → orders table
│   │   │   │   ├── OrderItem.java     # @Entity → order_items table
│   │   │   │   ├── PaymentLink.java   # @Entity → payment_link table
│   │   │   │   └── Transaction.java   # @Entity → transaction table
│   │   │   ├── dto/
│   │   │   │   ├── LoginRequest.java      # email, password
│   │   │   │   ├── RegisterRequest.java   # businessName, email, password
│   │   │   │   ├── CheckoutRequest.java   # userId, List<CartItem>
│   │   │   │   └── CartItem.java          # productId, quantity
│   │   │   └── security/
│   │   │       ├── JwtUtil.java    # generateToken(), extractEmail(), validateToken()
│   │   │       └── JwtFilter.java  # OncePerRequestFilter — reads Bearer token
│   │   └── resources/
│   │       └── application.properties  # DB URL, credentials, JPA settings
│   └── test/                           # Test directory (default, no custom tests)
├── pom.xml                             # Maven dependencies + build config
└── mvnw / mvnw.cmd                     # Maven wrapper scripts
```

---

# SECTION 4 — FRONTEND DETAILS

## Pages

| Page | File | Route | Description |
|---|---|---|---|
| Landing | `Landing.jsx` | `/` | Public home page with Hero, Features, Pricing, Footer |
| Login | `Login.jsx` | `/login` | Login form; stores JWT in localStorage; has Demo Mode shortcut |
| Register | `Register.jsx` | `/register` | Full form with client-side validation; 5 fields |
| Demo | `Demo.jsx` | `/demo` | Demo redirect page |
| Payment Page | `PaymentPage.jsx` | `/pay/:linkId` | Public customer payment page; select UPI or Card |
| Overview | `Overview.jsx` | `/dashboard` | Stats cards, donut chart, recent transactions table |
| Transactions | `Transactions.jsx` | `/dashboard/transactions` | Filterable, searchable transaction list |
| Payment Link | `PaymentLink.jsx` | `/dashboard/payment-links` | Create link, view QR, copy URL |
| Analytics | `Analytics.jsx` | `/dashboard/analytics` | Donut chart + 6 summary tiles |
| Orders | `Orders.jsx` | `/dashboard/orders` | All orders with "Pay Now" for PENDING orders |
| Shop | `Shop.jsx` | `/dashboard/shop` | Product grid with "Add to Cart" |
| Cart | `Cart.jsx` | `/dashboard/cart` | Cart items + order summary + checkout |
| Merchant | `Merchant.jsx` | `/dashboard/merchant` | Inventory table + Add/Edit product modal |
| Settings | `Settings.jsx` | `/dashboard/settings` | UI-only settings categories (no backend wired) |

## Components

| Component | Purpose |
|---|---|
| `Navbar.jsx` | Top navigation for public pages |
| `Hero.jsx` | Landing page hero with CTA buttons |
| `Features.jsx` | Feature cards on the landing page |
| `Pricing.jsx` | Pricing tiers section |
| `Footer.jsx` | Simple footer |
| `DashboardNavbar.jsx` | Dashboard top bar with hamburger toggle |
| `Sidebar.jsx` | Collapsible left navigation with links, active state, logout |
| `DashboardLayout.jsx` | Layout shell wrapping Sidebar + Navbar + `<Outlet />` |

## Routing (React Router DOM v7)
```jsx
// App.jsx
<BrowserRouter>
  <Routes>
    <Route path="/"            element={<Landing />} />
    <Route path="/login"       element={<Login />} />
    <Route path="/register"    element={<Register />} />
    <Route path="/demo"        element={<Demo />} />
    <Route path="/pay/:linkId" element={<PaymentPage />} />

    {/* Nested routes under DashboardLayout */}
    <Route path="/dashboard" element={<DashboardLayout />}>
      <Route index              element={<Overview />} />
      <Route path="transactions"  element={<Transactions />} />
      <Route path="payment-links" element={<PaymentLink />} />
      <Route path="analytics"     element={<AnalyticsPage />} />
      <Route path="settings"      element={<Settings />} />
      <Route path="orders"        element={<Orders />} />
      <Route path="shop"          element={<Shop />} />
      <Route path="cart"          element={<Cart />} />
      <Route path="merchant"      element={<Merchant />} />
    </Route>
  </Routes>
</BrowserRouter>
```

**Key routing concepts:**
- `<Outlet />` in `DashboardLayout` renders the matched child route
- `useNavigate()` for programmatic navigation (after login, after payment)
- `useParams()` in `PaymentPage` to extract `linkId` from URL
- `useLocation()` in `Sidebar` to check which route is active and highlight it

## State Management

**Three levels of state:**

**1. Local Component State (useState)**
Every page uses `useState` for its own data:
- Form fields (email, password, amount, etc.)
- API data (transactions, products, orders)
- UI state (loading, error messages, success flags, modal open/close)

**2. Global State via Context API**
Three contexts:
- `AuthContext` — JWT token, user object, `isAuthenticated`, `login()`, `logout()`, `loading`
- `CartContext` — cart array, `addToCart()`, `removeFromCart()`, `clearCart()`
- `RealtimeContext` — placeholder; `events` array (commented out SSE code)

**3. localStorage Persistence**
- JWT token: `localStorage.setItem("token", ...)`
- User data: `localStorage.setItem("user", JSON.stringify(userData))`
- Demo mode flag: `localStorage.setItem("isDemoMode", "true")`
- Demo mock data: `localStorage.setItem("demoData", JSON.stringify(...))`

## Hooks Used

| Hook | Location | Purpose |
|---|---|---|
| `useState` | All components | Local state: data, forms, loading, errors |
| `useEffect` | Overview, Shop, Merchant, Orders, Transactions, PaymentPage | Fetch data on mount |
| `useNavigate` | Login, PaymentPage, Cart, Shop, Transactions, Orders | Programmatic navigation |
| `useParams` | PaymentPage | Extract `linkId` from URL `/pay/:linkId` |
| `useLocation` | Sidebar | Detect active route for nav highlighting |
| `useContext` | AuthContext, CartContext, RealtimeContext consumers | Access global state |

**Custom Hooks:**
- `useAuth.js` — Wraps `AuthContext` + adds `loginAndRedirect()` and `logoutAndRedirect()` with `useNavigate`
- `useSEE.JS` — Same content as `useAuth.js` (appears to be a duplicate/backup)

## API Calling Method

**Fetch API** — used in:
- `authApi.js` → register, login
- `paymentApi.js` → createPaymentLink, getTransactions, getPaymentLinks, getPaymentLink, payNow
- `Login.jsx` → direct inline fetch
- `Register.jsx` → direct inline fetch

**Axios** — used in:
- `Shop.jsx` → `axios.get("/api/products")`
- `Orders.jsx` → `axios.get("/api/orders")`
- `Cart.jsx` → `axios.post("/api/checkout")`
- `Merchant.jsx` → `axios.get/post/put("/api/products")`

## Form Validation
Only `Register.jsx` has proper client-side validation via a `validate()` function:
```javascript
const validate = () => {
  const newErrors = {};
  if (!form.businessName.trim()) newErrors.businessName = "Business name is required";
  if (!form.email)               newErrors.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email address";
  if (!form.password)            newErrors.password = "Password is required";
  else if (form.password.length < 8) newErrors.password = "Must be at least 8 characters";
  if (form.confirmPassword !== form.password) newErrors.confirmPassword = "Passwords do not match";
  if (!form.terms)               newErrors.terms = "You must accept the terms";
  return Object.keys(newErrors).length === 0;
};
```

`Login.jsx` has no client-side validation — it relies on backend response strings ("User not found", "Invalid password").

**Note:** Spring Boot validation annotations (`@Valid`, `@NotBlank`) are **not used** in the backend DTOs.

## Styling Approach
- **Tailwind CSS v3** — utility-first classes directly in JSX
- **Custom design system** in `index.css` with reusable classes:
  - `.card` — glassmorphism dark card
  - `.btn-primary` — gradient indigo-violet button
  - `.btn-secondary` — outlined ghost button
  - `.input-premium` — styled dark input
  - `.table-premium` — styled dark table
  - `.glass-strong` — frosted glass effect
  - `.gradient-border` — gradient border wrapper
  - `.badge-success`, `.badge-failed`, `.badge-pending` — status badges
  - `.glow-blob` — ambient background glow orbs
  - Custom animations: `animate-fadeIn`, `animate-fadeUp`, `animate-float`, `animate-slideInRight`

## Libraries Used and Why

| Library | Why Used |
|---|---|
| `react-router-dom` | SPA navigation without page reloads; nested routes for dashboard |
| `axios` | Simpler syntax for product/checkout API calls with auto JSON parsing |
| `qrcode.react` | Render QR code entirely in the browser from a URL string |
| `recharts` | React-native chart components (PieChart) that work directly with state |
| `lucide-react` | Clean SVG icon library with consistent design, used for all icons |
| `framer-motion` | Installed for animations (partially used) |
| `tailwindcss` | Utility-first CSS for rapid UI development |
| `vite` | Fast dev server with hot reload; much faster than Create React App |

---

# SECTION 5 — BACKEND DETAILS

## Controller Classes

### `AuthController.java`
- Base path: `/api/auth`
- Injects: `AuthService`
- Methods:
  - `POST /register` → calls `authService.register(RegisterRequest)`; returns `String`
  - `POST /login` → calls `authService.login(LoginRequest)`; returns JWT `String`

### `PaymentController.java`
- Base path: `/api`
- Injects: `PaymentLinkService`, `QrCodeService`
- Methods:
  - `GET /pay/{linkId}/qr` → generates QR code, returns `byte[]` as `IMAGE_PNG`
  - `GET /payment-links` → returns all payment links as `List<PaymentLink>`
  - `POST /pay/{linkId}?method=UPI` → processes payment, returns `Transaction`

### `PaymentLinkController.java`
- Base path: `/api/payment-links`
- Injects: `PaymentLinkService`, `QrCodeService`
- Methods:
  - `POST /` → creates payment link, returns `PaymentLink`
  - `GET /{linkId}` → gets one payment link by UUID, returns `PaymentLink`
  - `GET /{linkId}/qr` → generates QR, returns `byte[]` as `IMAGE_PNG`

### `ProductController.java`
- Base path: `/api/products`
- Injects: `ProductRepository` (directly, no service layer)
- Methods:
  - `GET /` → returns `List<Product>`
  - `POST /` → saves product, returns `201 CREATED` with saved `Product`
  - `PUT /{id}` → updates product fields, returns updated `Product`
  - `DELETE /{id}` → deletes product, returns `204 NO_CONTENT`
- Has `@CrossOrigin(origins = "*", allowedHeaders = "*")`

### `DashboardController.java`
- Base path: `/api/dashboard`
- Injects: `PaymentLinkService`
- Methods:
  - `GET /summary` → computes totalPayments, totalRevenue, successfulPayments from transactions; returns `Map<String, Object>`
  - `GET /recent-transactions` → returns `List<Transaction>`

### `OrderController.java`
- Base path: `/api/orders`
- Injects: `OrderRepository` (directly)
- Methods:
  - `GET /` → returns `List<Order>` using `orderRepository.findAll()`

### `CheckoutController.java`
- Base path: `/api/checkout`
- Injects: `CheckoutService`
- Methods:
  - `POST /` → calls `checkoutService.checkout(CheckoutRequest)`; returns payment link UUID `String`

### `TransactionController.java`
- Base path: `/api/transactions`
- Injects: `PaymentLinkService` (via constructor injection)
- Methods:
  - `GET /` → returns all transactions ordered by date descending

## Service Classes

### `AuthService.java`
```
@Service
Injects: UserRepository, PasswordEncoder, JwtUtil

register(RegisterRequest):
  1. Check if email already exists → return "Email already registered"
  2. Hash password with BCrypt
  3. Save User to DB
  4. Return "Merchant registered successfully"

login(LoginRequest):
  1. Find user by email → if null, return "User not found"
  2. Match raw password with BCrypt hash → if no match, return "Invalid password"
  3. Generate JWT token with user's email as subject
  4. Return token string
```

### `PaymentLinkService.java`
```
@Service
Injects: PaymentLinkRepository, TransactionRepository, OrderRepository

createPaymentLink(amount, description):
  → Creates PaymentLink with UUID, sets status=ACTIVE, saves, returns

pay(linkId, method):
  1. Find PaymentLink by linkId
  2. Check if already PAID → throw RuntimeException
  3. Set status = PAID
  4. Create Transaction (SUCCESS, method, amount, paidAt)
  5. If orderId exists → update Order status to SUCCESS
  6. Save and return Transaction

getPaymentLink(linkId):
  → Finds by linkId
  → If not found, auto-creates from Order data (recovery logic)

getAllTransactions():
  → Returns transactionRepository.findAllByOrderByPaidAtDesc()

getAllLinks():
  → Returns paymentLinkRepository.findAll()
```

### `CheckoutService.java`
```
@Service
@Transactional
Injects: ProductRepository, OrderRepository, OrderItemRepository, PaymentLinkService

checkout(CheckoutRequest):
  1. For each cart item: validate stock, deduct stock, save product
  2. Calculate total amount
  3. Create Order (userId, totalAmount, status=PENDING)
  4. Create OrderItems for each cart item
  5. Create PaymentLink with UUID linked to Order
  6. Attach paymentLinkId to Order → save Order
  7. Return payment link UUID string
```

### `QrCodeService.java`
```
@Service
Uses: Google ZXing

generateQR(String text):
  1. Uses QRCodeWriter to encode text into BitMatrix (250x250)
  2. Creates BufferedImage, maps black/white pixels
  3. Writes as PNG to ByteArrayOutputStream
  4. Returns byte[]
```

## Repository Interfaces

All extend `JpaRepository<Entity, Long>`:

| Repository | Custom Methods |
|---|---|
| `UserRepository` | `Optional<User> findByEmail(String email)` |
| `ProductRepository` | None — standard CRUD only |
| `OrderRepository` | `Order findByPaymentLinkId(String linkId)` |
| `OrderItemRepository` | None — standard CRUD only |
| `PaymentLinkRepository` | `PaymentLink findByLinkId(String linkId)` |
| `TransactionRepository` | `List<Transaction> findAllByOrderByPaidAtDesc()` |

## Entity Classes

### `User.java`
```java
@Entity @Table(name = "users")
Fields: Long id, String businessName, String email (unique), String password
Methods: Manual getters and setters (no Lombok used for actual fields)
```

### `Product.java`
```java
@Entity @Table(name = "product")
Fields: Long id, String name, double price, int stock,
        String description (@Column(columnDefinition="TEXT")),
        String imageUrl (@Column(name="image_url")),
        Long merchantId
```

### `Order.java`
```java
@Entity @Table(name = "orders")
Fields: Long id, Long userId, double totalAmount,
        String paymentLinkId (@Column(name="payment_link_id")),
        String status  // PENDING, SUCCESS, FAILED
```

### `OrderItem.java`
```java
@Entity @Table(name = "order_items")
Fields: Long id, Long orderId, Long productId, int quantity
```

### `PaymentLink.java`
```java
@Entity
Fields: Long id, String linkId, Double amount, String description,
        String status, LocalDateTime createdAt, Long orderId
```

### `Transaction.java`
```java
@Entity
Fields: Long id, String linkId, Double amount, String status,
        LocalDateTime paidAt, String method, Long orderId
```

## DTOs (Data Transfer Objects)

| DTO | Fields | Purpose |
|---|---|---|
| `LoginRequest` | String email, String password | Receives login POST body |
| `RegisterRequest` | String businessName, String email, String password | Receives register POST body |
| `CheckoutRequest` | Long userId, List\<CartItem\> items | Receives checkout POST body |
| `CartItem` | Long productId, int quantity | Nested inside CheckoutRequest |

## Config Classes

### `SecurityConfig.java`
- Disables CSRF (stateless API doesn't need it)
- Sets session to `STATELESS` (no server-side sessions)
- Permits all `/api/**` endpoints (all routes are currently public)
- Adds `JwtFilter` before `UsernamePasswordAuthenticationFilter`
- Configures CORS: allows `http://localhost:5173`, all methods, all headers

### `PasswordConfig.java`
- Defines `BCryptPasswordEncoder` as a Spring `@Bean`
- Injected into `AuthService` for hashing and matching passwords

## Utility Classes (Security package)

### `JwtUtil.java`
```java
@Component
private final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256)

generateToken(String email):
  → Builds JWT with subject=email, issuedAt=now, expiration=24hrs, signed with HS256

extractEmail(String token):
  → Parses JWT, returns subject (email)

validateToken(String token):
  → Tries to parse JWT; returns true if valid, false on any exception
```

### `JwtFilter.java`
```java
@Component extends OncePerRequestFilter
doFilterInternal():
  → Reads "Authorization" header
  → If starts with "Bearer ", extracts token (substring(7))
  → If valid, extracts email, creates UsernamePasswordAuthenticationToken
  → Sets authentication in SecurityContextHolder
  → Always calls filterChain.doFilter() to proceed
```

## Exception Handling
- Backend uses `throw new RuntimeException(message)` in services
- `ProductController` uses try-catch returning `HttpStatus.INTERNAL_SERVER_ERROR`
- Frontend catches errors in `try/catch` blocks and shows messages
- **No `@ControllerAdvice` or `@ExceptionHandler` implemented**

## Validation
- **Backend:** `@Valid` annotation and Bean Validation (`@NotBlank`, `@Email`) are **not implemented** in DTOs
- **Frontend:** `Register.jsx` has manual JavaScript validation with regex for email, min-length for password, match check for confirm password

## Security Configuration Summary
```
CSRF → DISABLED
SESSION → STATELESS
CORS → Allowed origins: http://localhost:5173
JWT Filter → runs before Spring's auth filter on every request
Permitted routes → /api/auth/**, /api/pay/**, /api/payment-links/**, 
                   /api/transactions/**, /api/checkout, /api/products/**, 
                   /api/orders/**, /api/**
```

---

# SECTION 6 — DATABASE

## Table 1: `users`
| Column | Type | Constraint |
|---|---|---|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| business_name | VARCHAR(255) | |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password | VARCHAR(255) | BCrypt hash |

## Table 2: `product`
| Column | Type | Constraint |
|---|---|---|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(255) | |
| price | DOUBLE | |
| stock | INT | |
| description | TEXT | |
| image_url | VARCHAR(255) | |
| merchant_id | BIGINT | (logical FK to users.id) |

## Table 3: `orders`
| Column | Type | Constraint |
|---|---|---|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| user_id | BIGINT | (logical FK to users.id) |
| total_amount | DOUBLE | |
| status | VARCHAR(255) | PENDING / SUCCESS / FAILED |
| payment_link_id | VARCHAR(255) | (logical FK to payment_link.link_id) |

## Table 4: `order_items`
| Column | Type | Constraint |
|---|---|---|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| order_id | BIGINT | (logical FK to orders.id) |
| product_id | BIGINT | (logical FK to product.id) |
| quantity | INT | |

## Table 5: `payment_link`
| Column | Type | Constraint |
|---|---|---|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| link_id | VARCHAR(255) | UUID string |
| amount | DOUBLE | |
| description | VARCHAR(255) | |
| status | VARCHAR(255) | ACTIVE / PAID |
| created_at | DATETIME | |
| order_id | BIGINT | (logical FK to orders.id) |

## Table 6: `transaction`
| Column | Type | Constraint |
|---|---|---|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| link_id | VARCHAR(255) | UUID string |
| amount | DOUBLE | |
| status | VARCHAR(255) | SUCCESS / FAILED |
| paid_at | DATETIME | |
| method | VARCHAR(255) | UPI / CARD |
| order_id | BIGINT | (logical FK to orders.id) |

## Relationships
> Note: Relationships are stored as plain ID fields — no JPA `@ManyToOne` / `@JoinColumn` used.

```
users (1) ──────────────────── (*) product        [via product.merchant_id]
users (1) ──────────────────── (*) orders         [via orders.user_id]
orders (1) ─────────────────── (*) order_items    [via order_items.order_id]
product (1) ────────────────── (*) order_items    [via order_items.product_id]
orders (1) ─────────────────── (1) payment_link   [via orders.payment_link_id = payment_link.link_id]
payment_link (1) ───────────── (1) transaction    [via transaction.link_id = payment_link.link_id]
```

## ER Diagram (Text)
```
[users]──has──[product]
  |
  └──creates──[orders]──contains──[order_items]──references──[product]
                  |
                  └──linked_to──[payment_link]──paid_via──[transaction]
```

---

# SECTION 7 — REST APIs

### API 1: Register Merchant
| Field | Value |
|---|---|
| Endpoint | `/api/auth/register` |
| Method | POST |
| Controller | `AuthController.java` |
| Request Body | `{ "businessName": "Acme", "email": "a@b.com", "password": "pass123" }` |
| Response | `"Merchant registered successfully"` (String) or `"Email already registered"` |
| Purpose | Creates a new merchant account with BCrypt password |

### API 2: Login Merchant
| Field | Value |
|---|---|
| Endpoint | `/api/auth/login` |
| Method | POST |
| Controller | `AuthController.java` |
| Request Body | `{ "email": "a@b.com", "password": "pass123" }` |
| Response | JWT token string (plain text) or `"User not found"` / `"Invalid password"` |
| Purpose | Authenticates merchant; returns JWT for subsequent requests |

### API 3: Create Payment Link
| Field | Value |
|---|---|
| Endpoint | `/api/payment-links` |
| Method | POST |
| Controller | `PaymentLinkController.java` |
| Request Body | `{ "amount": 500.0, "description": "Invoice #1" }` |
| Response | `PaymentLink` JSON with `linkId` (UUID) |
| Purpose | Creates a new shareable payment link |

### API 4: Get Payment Link by ID
| Field | Value |
|---|---|
| Endpoint | `/api/payment-links/{linkId}` |
| Method | GET |
| Controller | `PaymentLinkController.java` |
| Request Body | None |
| Response | `PaymentLink` JSON |
| Purpose | Fetches link details for the payment page |

### API 5: Get QR Code (via PaymentLinkController)
| Field | Value |
|---|---|
| Endpoint | `/api/payment-links/{linkId}/qr` |
| Method | GET |
| Controller | `PaymentLinkController.java` |
| Request Body | None |
| Response | PNG image bytes (`MediaType.IMAGE_PNG`) |
| Purpose | Returns QR code image for the payment link |

### API 6: Get All Payment Links
| Field | Value |
|---|---|
| Endpoint | `/api/payment-links` |
| Method | GET |
| Controller | `PaymentController.java` |
| Request Body | None |
| Response | `List<PaymentLink>` JSON array |
| Purpose | Fetches all payment links for the dashboard |

### API 7: Get QR Code (via PaymentController)
| Field | Value |
|---|---|
| Endpoint | `/api/pay/{linkId}/qr` |
| Method | GET |
| Controller | `PaymentController.java` |
| Request Body | None |
| Response | PNG image bytes |
| Purpose | Alternate QR generation endpoint |

### API 8: Process Payment
| Field | Value |
|---|---|
| Endpoint | `/api/pay/{linkId}?method=UPI` |
| Method | POST |
| Controller | `PaymentController.java` |
| Request Body | None (method is a query param) |
| Response | `Transaction` JSON |
| Purpose | Executes payment; creates transaction, marks link as PAID, updates order |

### API 9: Get All Products
| Field | Value |
|---|---|
| Endpoint | `/api/products` |
| Method | GET |
| Controller | `ProductController.java` |
| Request Body | None |
| Response | `List<Product>` JSON array |
| Purpose | Fetches all products for the shop and inventory |

### API 10: Add Product
| Field | Value |
|---|---|
| Endpoint | `/api/products` |
| Method | POST |
| Controller | `ProductController.java` |
| Request Body | `{ "name": "...", "price": 500, "stock": 10, "imageUrl": "...", "merchantId": 1 }` |
| Response | Saved `Product` JSON (HTTP 201) |
| Purpose | Adds a new product to inventory |

### API 11: Update Product
| Field | Value |
|---|---|
| Endpoint | `/api/products/{id}` |
| Method | PUT |
| Controller | `ProductController.java` |
| Request Body | Full Product JSON with updated fields |
| Response | Updated `Product` JSON |
| Purpose | Updates product name, price, stock, image |

### API 12: Delete Product
| Field | Value |
|---|---|
| Endpoint | `/api/products/{id}` |
| Method | DELETE |
| Controller | `ProductController.java` |
| Request Body | None |
| Response | HTTP 204 No Content |
| Purpose | Removes a product |

### API 13: Dashboard Summary
| Field | Value |
|---|---|
| Endpoint | `/api/dashboard/summary` |
| Method | GET |
| Controller | `DashboardController.java` |
| Request Body | None |
| Response | `{ "totalPayments": 5, "totalRevenue": 10500.0, "successfulPayments": 4 }` |
| Purpose | Provides summary stats for dashboard overview |

### API 14: Recent Transactions
| Field | Value |
|---|---|
| Endpoint | `/api/dashboard/recent-transactions` |
| Method | GET |
| Controller | `DashboardController.java` |
| Request Body | None |
| Response | `List<Transaction>` JSON |
| Purpose | Fetches all transactions for the recent activity section |

### API 15: All Transactions
| Field | Value |
|---|---|
| Endpoint | `/api/transactions` |
| Method | GET |
| Controller | `TransactionController.java` |
| Request Body | None |
| Response | `List<Transaction>` sorted by paidAt descending |
| Purpose | Powers the Transactions page with full list |

### API 16: All Orders
| Field | Value |
|---|---|
| Endpoint | `/api/orders` |
| Method | GET |
| Controller | `OrderController.java` |
| Request Body | None |
| Response | `List<Order>` JSON |
| Purpose | Shows all orders in the Orders page |

### API 17: Checkout
| Field | Value |
|---|---|
| Endpoint | `/api/checkout` |
| Method | POST |
| Controller | `CheckoutController.java` |
| Request Body | `{ "userId": 1, "items": [{ "productId": 2, "quantity": 1 }] }` |
| Response | Payment link UUID string |
| Purpose | Validates stock, creates order + order items + payment link, returns link UUID |

---

# SECTION 8 — AUTHENTICATION & AUTHORIZATION

## Registration Flow (Step by Step)
1. User fills Register form: businessName, email, password, confirmPassword, terms checkbox
2. `validate()` runs client-side: checks required fields, email format, password length ≥ 8, password match, terms checkbox
3. If valid: `fetch("POST /api/auth/register", body)`
4. `AuthController.register()` receives `RegisterRequest`
5. `AuthService.register()`:
   - `userRepository.findByEmail(email)` — if exists, returns "Email already registered"
   - `passwordEncoder.encode(rawPassword)` → BCrypt hash
   - `new User()` with hashed password saved via `userRepository.save()`
   - Returns "Merchant registered successfully"
6. Frontend shows success state (green checkmark screen)
7. User clicks "Sign In Now" → navigates to `/login`

## Login Flow (Step by Step)
1. User enters email and password in `Login.jsx`
2. `fetch("POST /api/auth/login", body)` — plain `response.text()` used (not `.json()`)
3. `AuthController.login()` receives `LoginRequest`
4. `AuthService.login()`:
   - `userRepository.findByEmail(email)` → returns `Optional<User>`
   - If not found: return "User not found"
   - `passwordEncoder.matches(rawPassword, storedHash)` → if false: return "Invalid password"
   - `jwtUtil.generateToken(email)` → creates JWT
   - Returns JWT token string
5. Frontend checks if response is an error string or JWT:
   - Error → `setError(data)` → shows red error message
   - JWT → `localStorage.setItem("token", data)` → navigates to `/dashboard`
6. Demo Mode shortcut: `localStorage.setItem('isDemoMode', 'true')` → skips login

## JWT Flow
1. **Generation:** `JwtUtil.generateToken(email)` uses JJWT builder:
   ```java
   Jwts.builder()
     .setSubject(email)
     .setIssuedAt(new Date())
     .setExpiration(new Date(now + 24hours))
     .signWith(SECRET_KEY)  // HMAC-SHA256
     .compact()
   ```
2. **Storage:** Frontend stores token in `localStorage.getItem("token")`
3. **Sending:** Every protected request includes: `Authorization: Bearer <token>`
4. **Interception:** `JwtFilter.doFilterInternal()` reads the header on every request
5. **Validation:** `jwtUtil.validateToken(token)` → parses JWT; any exception = invalid
6. **Identity:** `jwtUtil.extractEmail(token)` → gets email (subject) from token body
7. **Context:** Creates `UsernamePasswordAuthenticationToken(email, null, [])` → set in `SecurityContextHolder`

## Password Encryption
- Algorithm: **BCrypt** via `BCryptPasswordEncoder`
- BCrypt automatically:
  - Adds a random salt
  - Hashes with cost factor
  - Stores salt within the hash itself
- Verification: `passwordEncoder.matches(rawPassword, storedHash)` compares correctly

## Session / Token Handling
- **No server-side sessions** — `SessionCreationPolicy.STATELESS`
- Token lives in `localStorage` on the client
- On logout: `localStorage.removeItem("token")` + `localStorage.removeItem("user")`
- Token expiry: 24 hours — frontend has no auto-refresh mechanism

## Protected Routes
- **All backend routes are currently permitted** in `SecurityConfig` (`.requestMatchers("/api/**").permitAll()`)
- **Frontend has no route guards** — any user can navigate to `/dashboard` URLs manually
- **Note to interviewer:** This is a known limitation; proper `PrivateRoute` guards and backend authorization are improvements to add

---

# SECTION 9 — PROJECT WORKFLOW (COMPLETE REQUEST FLOW)

**Scenario: Customer completes checkout and pays**

```
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: Customer browses Shop.jsx                               │
│  → Clicks "Add to Cart"                                          │
│  → CartContext.addToCart(product) updates cart state            │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: Customer goes to Cart.jsx                               │
│  → Sees items and subtotal                                       │
│  → Clicks "Proceed to Payment"                                   │
│  → handleCheckout() called                                       │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: HTTP Request from Cart.jsx                              │
│  axios.post("http://localhost:8080/api/checkout", {             │
│    userId: 1,                                                    │
│    items: [{ productId: 2, quantity: 1 }]                       │
│  })                                                              │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  STEP 4: JwtFilter.java intercepts request                       │
│  → Reads "Authorization: Bearer <token>" header                  │
│  → jwtUtil.validateToken(token) → valid                          │
│  → Sets authentication in SecurityContextHolder                  │
│  → filterChain.doFilter() → proceeds                             │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  STEP 5: CheckoutController.java                                 │
│  @PostMapping on /api/checkout                                   │
│  @RequestBody CheckoutRequest request                            │
│  → calls checkoutService.checkout(request)                       │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  STEP 6: CheckoutService.java (@Transactional)                   │
│  For each cart item:                                             │
│    productRepo.findById(productId) → finds Product               │
│    if stock < quantity → throw RuntimeException                   │
│    product.setStock(stock - quantity)                            │
│    productRepo.save(product)  → UPDATE product SET stock=...     │
│    total += price * quantity                                     │
│                                                                  │
│  Order order = new Order()                                       │
│  order.setUserId(1); order.setTotalAmount(total)                 │
│  order.setStatus("PENDING")                                      │
│  order = orderRepo.save(order)  → INSERT into orders             │
│                                                                  │
│  For each item:                                                  │
│    OrderItem oi = new OrderItem()                                │
│    oi.setOrderId(order.getId())                                  │
│    oi.setProductId(item.getProductId())                          │
│    orderItemRepo.save(oi)  → INSERT into order_items             │
│                                                                  │
│  PaymentLink link = new PaymentLink()                            │
│  link.setLinkId(UUID.randomUUID().toString())                    │
│  link.setAmount(total); link.setStatus("ACTIVE")                 │
│  link.setOrderId(order.getId())                                  │
│  link = paymentService.saveLink(link)  → INSERT into payment_link│
│                                                                  │
│  order.setPaymentLinkId(link.getLinkId())                        │
│  orderRepo.save(order)  → UPDATE orders SET payment_link_id=...  │
│                                                                  │
│  return link.getLinkId()  ← UUID string                          │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  STEP 7: MySQL Database Operations                               │
│  → product row updated (stock decremented)                       │
│  → Row inserted into orders                                      │
│  → Row(s) inserted into order_items                              │
│  → Row inserted into payment_link                                │
│  → orders row updated with payment_link_id                       │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  STEP 8: HTTP Response back to Cart.jsx                          │
│  Response body: "abc-123-uuid-string"                            │
│  const linkId = res.data                                         │
│  clearCart()                                                     │
│  navigate(`/pay/${linkId}`)                                      │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  STEP 9: PaymentPage.jsx loads at /pay/abc-123-uuid-string       │
│  useEffect → getPaymentLink(linkId)                              │
│  → GET /api/payment-links/abc-123-uuid-string                    │
│  → Returns PaymentLink JSON with amount, status, description     │
│  → setData(res)                                                  │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  STEP 10: Customer selects "UPI" and clicks "Pay ₹500"           │
│  → handlePay() called                                            │
│  → payNow(linkId, "UPI")                                         │
│  → POST /api/pay/abc-123-uuid-string?method=UPI                  │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  STEP 11: PaymentController → PaymentLinkService.pay()          │
│  → Find PaymentLink by linkId                                    │
│  → Check if PAID → not yet                                       │
│  → Set status = "PAID" → save                                    │
│  → Create Transaction (SUCCESS, UPI, 500, now)                   │
│  → Find Order by orderId → set status = SUCCESS → save           │
│  → Returns Transaction JSON                                      │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  STEP 12: PaymentPage.jsx receives response                      │
│  → res.status === "SUCCESS"                                      │
│  → setSuccess(true) → shows "Payment Successful!" screen         │
│  → setTimeout(2s) → navigate("/dashboard")                       │
└─────────────────────────────────────────────────────────────────┘
```

---

# SECTION 10 — IMPORTANT ANNOTATIONS

## Backend Annotations

### `@SpringBootApplication` — `MerchantpayBackendApplication.java`
Combination of `@Configuration` + `@EnableAutoConfiguration` + `@ComponentScan`. Tells Spring to auto-configure everything and scan for components in the same package.

### `@RestController` — All Controller classes
Combination of `@Controller` + `@ResponseBody`. Every method's return value is automatically serialized to JSON and written to the HTTP response body.

### `@Controller`
Base annotation — marks a class as a Spring MVC controller. Not directly used alone here; `@RestController` is used.

### `@Service` — `AuthService`, `PaymentLinkService`, `CheckoutService`, `QrCodeService`
Marks the class as a service layer bean. Functionally same as `@Component` but semantically meaningful — contains business logic.

### `@Repository` — Not used directly
All repositories extend `JpaRepository`, which is itself annotated with `@Repository`. Spring Data JPA handles the repository beans automatically.

### `@Entity` — All entity classes
Tells Hibernate/JPA that this class maps to a database table. Hibernate auto-creates the table using the class structure.

### `@Table(name = "users")` — `User.java`, `Order.java`, etc.
Specifies the exact MySQL table name. Without this, Hibernate uses the class name (e.g., `User` → `user` table).

### `@Id` — All entities
Marks the field as the primary key.

### `@GeneratedValue(strategy = GenerationType.IDENTITY)`
Tells the database to auto-generate the ID using AUTO_INCREMENT.

### `@Column` — `Product.java`, `Order.java`
Used to map Java field names to specific column names (e.g., `imageUrl` → `image_url`) or customize column behavior (e.g., `columnDefinition = "TEXT"`).

### `@Autowired` — Most controllers and services
Injects Spring-managed beans automatically by type. Used heavily — example: `@Autowired private AuthService authService`.

### `@RequestMapping` — On controller classes
Sets the base URL path for all methods in that controller. E.g., `@RequestMapping("/api/auth")`.

### `@GetMapping` — All GET endpoints
Shortcut for `@RequestMapping(method = RequestMethod.GET)`.

### `@PostMapping` — All POST endpoints
Shortcut for `@RequestMapping(method = RequestMethod.POST)`.

### `@PutMapping` — `ProductController`
Shortcut for `@RequestMapping(method = RequestMethod.PUT)`. Used to update a product.

### `@DeleteMapping` — `ProductController`
Shortcut for `@RequestMapping(method = RequestMethod.DELETE)`. Used to delete a product.

### `@PathVariable` — Multiple controllers
Extracts a variable from the URL path. Example: `@GetMapping("/{linkId}")` → `@PathVariable String linkId`.

### `@RequestParam` — `PaymentController`
Extracts a query parameter from the URL. Example: `?method=UPI` → `@RequestParam String method`.

### `@RequestBody` — Multiple controllers
Deserializes the HTTP request body (JSON) into a Java object. Example: `@RequestBody LoginRequest request`.

### `@Valid`
**Not used** in this project's DTOs. No Bean Validation annotations are applied.

### `@Component` — `JwtUtil.java`, `JwtFilter.java`
Generic stereotype annotation — makes the class a Spring-managed bean. Used when `@Service`, `@Repository`, or `@Controller` doesn't semantically fit.

### `@Configuration` — `SecurityConfig.java`
Indicates the class contains Spring bean definitions (`@Bean` methods). Processed at startup.

### `@Bean` — `SecurityConfig.corsConfigurationSource()`, `PasswordConfig`
Declares a method that produces a Spring-managed bean. The returned object is registered in the Spring application context.

### `@Transactional` — `CheckoutService.checkout()`
Wraps the method in a database transaction. If any exception occurs mid-way, all database changes are rolled back automatically.

### `@CrossOrigin` — `ProductController`, `OrderController`
Allows cross-origin requests from different domains. Used on ProductController to allow the React frontend at port 5173 to call the Spring Boot backend at port 8080.

---

# SECTION 11 — IMPORTANT REACT CONCEPTS

## Components
Every `.jsx` file is a React component. Components are reusable UI pieces.
- **Functional components** used throughout — `export default function Overview() { ... }`
- No class components anywhere in the project

## Props
- `DashboardLayout` passes `open` (boolean) and `closeSidebar` (function) to `Sidebar`
- `Sidebar` receives `{ open, closeSidebar }` as props and toggles visibility based on `open`
- `DashboardNavbar` receives `{ toggle }` function prop for hamburger button

## State (useState)
Used in every component for different purposes:
```javascript
const [transactions, setTransactions] = useState([]);   // API data
const [loading, setLoading]           = useState(true); // loading spinner
const [error, setError]               = useState("");   // error messages
const [form, setForm]                 = useState({});   // form fields
const [open, setOpen]                 = useState(false); // modal/sidebar toggle
```

## useEffect
Used for data fetching on component mount:
```javascript
useEffect(() => {
  fetchData(); // API call
}, []); // empty array = run once on mount
```
Also used in `AuthContext` to load token from localStorage on app start.

## React Router
- `BrowserRouter` wraps the entire app in `main.jsx`
- `Routes` and `Route` define the routing tree in `App.jsx`
- Nested routes: `/dashboard` + child routes; `<Outlet />` in `DashboardLayout` renders children
- `<Link>` — for anchor-style navigation (Register, Sidebar links)
- `useNavigate()` — for programmatic navigation (after login, after checkout)
- `useParams()` — extract `linkId` from `/pay/:linkId` in `PaymentPage`
- `useLocation()` — detect current path in `Sidebar` for active link highlighting

## Fetch API vs Axios
Both are used in this project:

**Fetch API** (native browser):
```javascript
const res = await fetch(`${BASE_URL}/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
const data = await res.text(); // or res.json()
```

**Axios** (library):
```javascript
const res = await axios.get("http://localhost:8080/api/products");
const data = res.data; // auto-parsed JSON
```

## Context API
Three contexts created with `createContext()`:

**AuthContext:**
```javascript
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const login = async (data) => { ... };
  const logout = () => { ... };
  return <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
    {children}
  </AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);
```

**CartContext:** Manages `cart` array with `addToCart`, `removeFromCart`, `clearCart`  
**RealtimeContext:** Placeholder with `events` array; commented-out SSE code

## Custom Hooks
`useAuth.js` — wraps the AuthContext hook and adds redirect logic:
```javascript
export default function useAuth() {
  const auth = useAuthContext();
  const navigate = useNavigate();
  const loginAndRedirect = async (data) => {
    await auth.login(data);
    navigate("/");
  };
  const logoutAndRedirect = () => {
    auth.logout();
    navigate("/login");
  };
  return { ...auth, loginAndRedirect, logoutAndRedirect };
}
```

---

# SECTION 12 — IMPORTANT JAVA CONCEPTS

## OOP Concepts Used

**Encapsulation:**
- All entity fields are `private` with public getters and setters
- DTOs like `LoginRequest` encapsulate the request data

**Abstraction:**
- Repository interfaces (`UserRepository extends JpaRepository`) abstract all database operations
- Service classes abstract business logic away from controllers

**Inheritance:**
- All repositories extend `JpaRepository<Entity, Long>` which gives free methods: `findAll()`, `findById()`, `save()`, `deleteById()`
- `JwtFilter extends OncePerRequestFilter` to override HTTP filter behavior

**Polymorphism:**
- `JpaRepository` provides generic methods; each repository adds its own specific queries on top

## Collections Used
```java
List<Transaction> getAllTransactions() // in service layer
List<Product> getAllProducts()         // in ProductController
List<Order> getAllOrders()             // in OrderController
Map<String, Object> summary = new HashMap<>(); // in DashboardController
```
Streams used on List for filtering/summing.

## Exception Handling
```java
// Throwing
throw new RuntimeException("Payment link not found");
throw new RuntimeException("Payment already completed");
throw new RuntimeException("Insufficient stock for " + product.getName());

// Catching (in ProductController)
try {
  Product savedProduct = productRepository.save(product);
  return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
} catch (Exception e) {
  return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
}
```

## Streams and Lambda Expressions
Used in `DashboardController`:
```java
double totalRevenue = transactions.stream()
    .mapToDouble(Transaction::getAmount) // Method reference
    .sum();

long successfulPayments = transactions.stream()
    .filter(t -> "SUCCESS".equals(t.getStatus())) // Lambda
    .count();
```

Also in `CheckoutService`:
```java
for (CartItem item : request.getItems()) { ... } // enhanced for loop
total += product.getPrice() * item.getQuantity();
```

## Optional
Used with `UserRepository`:
```java
Optional<User> userOpt = userRepository.findByEmail(email);
// Used with .isPresent() check
if (userRepository.findByEmail(request.getEmail()).isPresent()) {
    return "Email already registered";
}
// In login:
User user = userRepository.findByEmail(request.getEmail()).orElse(null);
```

Also with `OrderRepository`:
```java
Order order = orderRepository.findById(link.getOrderId()).orElseThrow();
```

## UUID Generation
```java
link.setLinkId(UUID.randomUUID().toString()); // generates random UUID
```

## LocalDateTime
```java
link.setCreatedAt(LocalDateTime.now()); // stores current timestamp
tx.setPaidAt(LocalDateTime.now());
```

## Multithreading
**Not implemented.** The application is single-threaded from a developer perspective. Spring Boot embeds Tomcat which handles thread-per-request concurrency internally.

---

# SECTION 13 — SPRING BOOT CONCEPTS

## Dependency Injection (DI)
Spring creates and manages objects (beans). You declare dependencies with `@Autowired` or constructor injection, and Spring injects them automatically:
```java
@Autowired
private AuthService authService; // Spring creates AuthService and injects it

// Constructor injection (used in TransactionController):
public TransactionController(PaymentLinkService paymentLinkService) {
    this.paymentLinkService = paymentLinkService;
}
```

## Inversion of Control (IoC)
You do not call `new AuthService()` anywhere. Spring controls the creation of objects. You just declare what you need — Spring handles the rest. This is the "Don't call us, we'll call you" principle.

## Bean
Any class managed by Spring's IoC container is a "bean". Beans are created from classes annotated with `@Component`, `@Service`, `@Repository`, `@Controller`, or methods annotated with `@Bean` in `@Configuration` classes.

## Spring Data JPA
Removes boilerplate database code. Instead of writing SQL, you:
1. Create an interface extending `JpaRepository<Entity, Long>`
2. Spring auto-generates implementation with common methods
3. You can add custom queries by naming methods: `findByEmail`, `findByLinkId`, `findByPaymentLinkId`

## Hibernate (ORM)
- Maps Java classes to MySQL tables via `@Entity` annotation
- `@Table(name="users")` maps to the exact table name
- `@Column(name="image_url")` maps Java's `imageUrl` to MySQL's `image_url`
- `spring.jpa.hibernate.ddl-auto=update` means Hibernate auto-creates/updates tables on startup

## Repository Pattern
Separates data access logic into repository interfaces. Controllers and services never write SQL or deal with JDBC directly. They call repository methods like `userRepository.save(user)` or `productRepository.findAll()`.

## MVC Architecture
```
Model      → Entity classes (User, Product, Order, etc.) + Database
View       → React frontend (Spring Boot is headless API)
Controller → @RestController classes handle HTTP requests
Service    → @Service classes contain business logic between Controller and Repository
```

## `@Transactional` in Spring
When applied to `CheckoutService.checkout()`, Spring wraps the entire method in one database transaction. If any step fails (e.g., product not found, stock insufficient), all previous database changes in that method are rolled back automatically.

---

# SECTION 14 — CHALLENGES & SOLUTIONS

### Challenge 1: CORS Blocking Between React (5173) and Spring Boot (8080)
**Problem:** Browser blocked cross-origin requests from port 5173 to 8080.  
**Solution:** Added `CorsConfigurationSource` bean in `SecurityConfig.java`:
```java
config.setAllowedOrigins(List.of("http://localhost:5173"));
config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
config.setAllowedHeaders(List.of("*"));
config.setAllowCredentials(true);
```
Also added `@CrossOrigin(origins = "*")` on `ProductController` as an extra measure.

### Challenge 2: JWT Integration with Spring Security
**Problem:** Spring Security blocked all requests by default.  
**Solution:** Created `JwtFilter extends OncePerRequestFilter`, registered it before `UsernamePasswordAuthenticationFilter`, disabled CSRF, set session to STATELESS, and permitted all `/api/**` routes.

### Challenge 3: Double Payment Prevention
**Problem:** Reloading the payment page could process payment twice.  
**Solution:** In `PaymentLinkService.pay()`:
```java
if ("PAID".equals(link.getStatus())) {
    throw new RuntimeException("Payment already completed");
}
```
Frontend `PaymentPage.jsx` also checks `data.status === "PAID"` and shows "Already Paid" screen.

### Challenge 4: Payment Link Missing After Checkout
**Problem:** The checkout created a payment link but sometimes `getPaymentLink()` returned null when the link wasn't found by UUID.  
**Solution:** Added auto-recovery logic in `PaymentLinkService.getPaymentLink()`:
```java
// If link not found, reconstruct it from the Order
Order order = orderRepository.findByPaymentLinkId(linkId);
PaymentLink newLink = new PaymentLink();
newLink.setLinkId(linkId);
newLink.setAmount(order.getTotalAmount());
// ... save and return
```

### Challenge 5: Demonstrating Without Backend
**Problem:** Showcasing the app required a running Spring Boot + MySQL setup.  
**Solution:** Implemented Demo Mode — `isDemoMode()` checks `localStorage.getItem("isDemoMode") === "true"`. When true, all API functions return pre-seeded mock data stored in localStorage instead of calling the backend.

### Challenge 6: Stock Management Integrity
**Problem:** Multiple checkouts could oversell a product.  
**Solution:** `@Transactional` on `CheckoutService.checkout()` ensures stock deduction and order creation are atomic — all or nothing. `if (product.getStock() < item.getQuantity()) throw RuntimeException` prevents overselling.

### Challenge 7: `imageUrl` vs `image_url` Column Mismatch
**Problem:** Java's `imageUrl` field didn't map to MySQL's `image_url` column.  
**Solution:** Added `@Column(name = "image_url")` to the field in `Product.java`.

---

# SECTION 15 — FUTURE IMPROVEMENTS

1. **Real Payment Gateway Integration** — Razorpay SDK is already in `pom.xml` but not wired. Integrate it to process actual payments.
2. **Route Guards / Private Routes** — Add `PrivateRoute` component in React to redirect unauthenticated users from `/dashboard`
3. **Backend Authorization** — Properly restrict APIs so only authenticated merchants can access their own data
4. **Merchant-specific Data Filtering** — Currently all merchants see all products/orders. Add `merchantId` filtering
5. **Refresh Tokens** — Implement JWT refresh token flow so sessions don't expire abruptly
6. **Email Verification** — Send confirmation email on registration
7. **Password Reset Flow** — Add forgot-password endpoint with email OTP
8. **WebSocket / SSE for Real-time Updates** — `RealtimeContext.jsx` has placeholder code for this
9. **Global Exception Handler** — Add `@ControllerAdvice` + `@ExceptionHandler` to return structured error responses
10. **Bean Validation** — Add `@Valid`, `@NotBlank`, `@Email` to DTOs for backend validation
11. **Pagination** — Add pageable responses for transactions and orders
12. **Deployment** — Deploy frontend on Vercel/Netlify, backend on AWS/Railway, DB on PlanetScale
13. **Unit Tests** — Write JUnit tests for service layer; Jest/React Testing Library for frontend
14. **Logout Token Blacklist** — Currently JWT cannot be invalidated; implement a token blacklist
15. **Analytics Enhancements** — Add time-series revenue chart, date range filters, export to CSV

---

# SECTION 16 — 100+ INTERVIEW QUESTIONS

## Beginner Questions

**1.** What is MerchantPay? Explain it in one sentence.  
*A full-stack payment management web application where merchants can create payment links, generate QR codes, and track transactions in a dashboard.*

**2.** What is the frontend technology used?  
*React 19 with Vite as the build tool.*

**3.** What is the backend technology used?  
*Spring Boot 3.3.5 with Java 17.*

**4.** What database is used and where is it configured?  
*MySQL. Configured in `application.properties` with `spring.datasource.url=jdbc:mysql://localhost:3306/merchantpay`.*

**5.** What is JWT? Why is it used here?  
*JSON Web Token — a stateless authentication token. Used so the server doesn't need to store sessions. The token is signed with HMAC-SHA256 and carries the user's email.*

**6.** What is BCrypt and why is it used?  
*BCrypt is a password hashing algorithm. Passwords are never stored as plain text. BCrypt adds a random salt and hashes the password. Verification uses `passwordEncoder.matches()`.*

**7.** How does a merchant register in MerchantPay?  
*Fills the Register form → frontend validates → POST /api/auth/register → AuthService checks duplicate email, hashes password, saves User → returns success message.*

**8.** What is Tailwind CSS?  
*A utility-first CSS framework where you apply pre-built class names directly in HTML/JSX (like `bg-indigo-500`, `text-white`) instead of writing separate CSS files.*

**9.** What is the purpose of `application.properties`?  
*Configures Spring Boot: database URL, username, password, Hibernate DDL mode, and SQL logging.*

**10.** What does `spring.jpa.hibernate.ddl-auto=update` do?  
*Tells Hibernate to automatically create or update database tables based on entity classes on every startup.*

**11.** What is `@Entity`?  
*JPA annotation that marks a class as a database entity/table mapping.*

**12.** What is `@RestController`?  
*Combines `@Controller` + `@ResponseBody`. Returns JSON responses directly from methods.*

**13.** What is React Router?  
*A library that provides client-side routing in React apps, allowing navigation between pages without full page reloads.*

**14.** What is `useState` in React?  
*A React hook that lets functional components have local state. Returns `[value, setter]` pair.*

**15.** What is `useEffect` in React?  
*A React hook that runs side effects (like API calls) after the component renders. Empty dependency array `[]` means run once on mount.*

**16.** What is Context API?  
*React's built-in global state management system. Avoids passing props through many component levels.*

**17.** What is Maven?  
*A Java build tool that manages project dependencies via `pom.xml` and compiles/packages the application.*

**18.** What does `@Autowired` do?  
*Tells Spring to automatically inject a bean (dependency) into the class. Spring finds the matching bean by type.*

**19.** What is an API? Give an example from MerchantPay.  
*Application Programming Interface — a way for the frontend to communicate with the backend. Example: `POST /api/auth/login` accepts email/password and returns a JWT.*

**20.** What is the role of the Sidebar component?  
*A collapsible left navigation panel with links to all dashboard pages and a logout button.*

---

## Intermediate Questions

**21.** Explain the authentication flow from login to accessing the dashboard.  
*Login form → POST /api/auth/login → AuthService validates credentials → generates JWT → frontend stores in localStorage → subsequent requests include Authorization header → JwtFilter validates token → request proceeds.*

**22.** What is `JpaRepository` and what methods does it provide?  
*A Spring Data JPA interface. Extending it gives: `findAll()`, `findById()`, `save()`, `deleteById()`, `existsById()`, `count()`. No SQL needed.*

**23.** How are custom queries written in Spring Data JPA?  
*By naming methods following Spring's conventions. Example: `findByEmail(String email)` → Spring generates `SELECT * FROM users WHERE email = ?`.*

**24.** What is `@Transactional` and where is it used?  
*Wraps the method in a database transaction. Used in `CheckoutService.checkout()` — if stock deduction fails or any step throws, all DB changes roll back.*

**25.** What is the difference between `@PathVariable` and `@RequestParam`?  
*`@PathVariable` extracts from the URL path: `/pay/{linkId}`. `@RequestParam` extracts from the query string: `?method=UPI`.*

**26.** Explain how QR code generation works.  
*Frontend requests `GET /api/pay/{linkId}/qr`. `QrCodeService.generateQR()` uses Google ZXing to encode the payment URL into a 250×250 QR BitMatrix, converts to PNG bytes using `BufferedImage` + `ImageIO`, returns as `byte[]` with `MediaType.IMAGE_PNG`.*

**27.** What is the checkout flow end-to-end?  
*Cart.jsx sends POST /api/checkout → CheckoutService validates stock (deducts it), creates Order, creates OrderItems, creates PaymentLink with UUID → returns UUID → frontend navigates to /pay/{uuid} → customer pays → PaymentLinkService marks PAID, creates Transaction, updates Order.*

**28.** Why does the project use both Fetch API and Axios?  
*Fetch is used in auth and payment API modules. Axios is used directly in Shop, Cart, Orders, and Merchant components. Both work; having both shows practical flexibility, though ideally one should be standardized.*

**29.** What is the purpose of `SecurityConfig.java`?  
*Configures Spring Security: disables CSRF, sets stateless sessions, configures CORS, permits specific URL patterns, and adds the JwtFilter to the filter chain.*

**30.** How does Demo Mode work?  
*`isDemoMode()` checks `localStorage.getItem("isDemoMode") === "true"`. When true, all API functions return mock data stored in localStorage. No backend calls are made.*

**31.** What is the Outlet component in React Router?  
*`<Outlet />` is a placeholder in a layout component that renders the matched child route's component. Used in `DashboardLayout.jsx`.*

**32.** What is a DTO? Give examples from the project.  
*Data Transfer Object — a simple class used to transfer data between layers. Examples: `LoginRequest` (email, password), `RegisterRequest`, `CheckoutRequest` (userId, items list).*

**33.** How does password verification work?  
*`passwordEncoder.matches(rawPassword, storedHash)` — BCrypt internally extracts the salt from the stored hash and rehashes the raw password with it, then compares.*

**34.** What is `UUID.randomUUID().toString()` and why is it used for payment links?  
*Generates a random 128-bit universally unique identifier. Used for payment link IDs because: (1) practically impossible to guess, (2) globally unique even without database checks.*

**35.** What does `OncePerRequestFilter` guarantee?  
*The filter's `doFilterInternal()` method runs exactly once per HTTP request, even in filter chains that might invoke filters multiple times. Used by JwtFilter.*

**36.** Explain how CartContext works.  
*Creates a Context with `cart` array and three functions. `addToCart` checks if item exists (increases quantity) or adds new item. `removeFromCart` filters out by ID. `clearCart` resets to `[]`. Shop and Cart pages consume this context.*

**37.** What happens when a payment link is already PAID and someone tries to pay again?  
*`PaymentLinkService.pay()` checks `"PAID".equals(link.getStatus())` → throws `RuntimeException("Payment already completed")`. Frontend also checks `data.status === "PAID"` → shows "Already Paid" UI.*

**38.** How is client-side form validation implemented in Register.jsx?  
*A `validate()` function creates an `errors` object. Checks: businessName not empty, email format (regex), password ≥ 8 chars, passwords match, terms checkbox checked. Returns `false` if any error exists.*

**39.** What is `@GeneratedValue(strategy = GenerationType.IDENTITY)`?  
*Tells JPA to use the database's AUTO_INCREMENT strategy for generating primary keys. MySQL assigns the next available ID.*

**40.** What is the difference between `@Service`, `@Component`, and `@Repository`?  
*All are stereotypes of `@Component` — they make the class a Spring bean. `@Repository` adds exception translation for database errors. `@Service` is semantic — marks business logic. `@Component` is generic.*

---

## Advanced Questions

**41.** Why is CSRF disabled in `SecurityConfig`?  
*CSRF attacks require session cookies. Since this API is stateless (JWT in header, no cookies), CSRF is not applicable. Disabling it removes unnecessary processing.*

**42.** How does Spring Security filter chain work with the JwtFilter?  
*Spring Security processes requests through a chain of filters. `JwtFilter` is added before `UsernamePasswordAuthenticationFilter`. It reads the JWT, validates it, and sets the authentication in `SecurityContextHolder` before Spring's own auth filter runs.*

**43.** What is `SecurityContextHolder` and what does setting authentication in it do?  
*A thread-local storage for the current user's security context. Setting authentication tells Spring Security that the current request is authenticated. Spring then allows the request to proceed to the controller.*

**44.** What is the issue with the current `SECRET_KEY` in JwtUtil?  
```java
private final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
```
*The key is generated randomly at startup. Every time the server restarts, a new key is generated, invalidating all existing tokens. In production, this should be a fixed key loaded from an environment variable.*

**45.** Why does `TransactionController` use constructor injection while others use `@Autowired`?  
*Both are valid. Constructor injection is generally preferred because it makes dependencies explicit, allows final fields, and makes testing easier. `@Autowired` on fields is simpler but less testable.*

**46.** How does `findAllByOrderByPaidAtDesc()` work without writing SQL?  
*Spring Data JPA derives queries from method names: `findAll` → select all, `By` separator, `OrderBy` → order clause, `PaidAt` → column, `Desc` → descending. Spring generates `SELECT * FROM transaction ORDER BY paid_at DESC`.*

**47.** What is the issue with the current security configuration allowing all `/api/**`?  
*It makes the JwtFilter effectively useless — even without a valid token, all endpoints are accessible. Proper security should require authentication for sensitive endpoints like dashboard, transactions, and product management.*

**48.** Explain the auto-recovery logic in `getPaymentLink()`.  
*If `findByLinkId(linkId)` returns null (link missing), the code searches for an Order with that `paymentLinkId` via `orderRepository.findByPaymentLinkId()`. If found, it reconstructs and saves a new PaymentLink from the order data. This prevents 404 errors from broken checkout flows.*

**49.** Why is `@Transactional` critical in `CheckoutService.checkout()`? What would happen without it?  
*Without `@Transactional`, if stock deduction succeeds for item 1 but fails for item 2, item 1's stock would be permanently deducted with no order created. With `@Transactional`, the entire operation rolls back on any failure.*

**50.** What are the limitations of storing JWT in localStorage vs HttpOnly cookies?  
*localStorage is accessible by JavaScript — vulnerable to XSS attacks. HttpOnly cookies cannot be read by JS — safer against XSS. However, cookies require CSRF protection. This project uses localStorage for simplicity.*

**51.** How does recharts' PieChart work with React state?  
*PieChart accepts `data` prop — an array of objects with `name` and `value`. These values are computed directly from the `transactions` state using `.filter().length`. When state updates, React re-renders and the chart automatically reflects new data.*

**52.** What is the `useLocation` hook used for in Sidebar?  
*`const location = useLocation()` gives the current URL path. `isActive(path) => location.pathname === path` checks if a nav link matches the current page. Active links get highlighted styling.*

**53.** Why does `DashboardController.getSummary()` compute stats from transactions instead of storing them?  
*Computed stats are always accurate without needing a separate aggregation table. The tradeoff is performance — on large datasets, pre-computed values would be faster. For this project's scale, on-the-fly computation is fine.*

**54.** What would happen if you removed `@Column(name="image_url")` from Product?  
*Hibernate would look for a column named `imageurl` (lowercased) instead of `image_url`. Inserts and selects for imageUrl would fail with a column-not-found SQL error.*

**55.** Why is `LocalDateTime` used instead of `Date` for `paidAt` and `createdAt`?  
*`LocalDateTime` is part of Java 8's new date-time API. It's immutable, thread-safe, and cleaner than the legacy `java.util.Date`. Hibernate maps it to MySQL DATETIME.*

---

## Cross / Follow-up Questions

**56.** You said JWT is stateless. Then how do you implement logout?  
*Currently, logout just removes the token from localStorage. The token remains valid on the server until it expires (24 hours). Proper logout would require a server-side token blacklist.*

**57.** You said BCrypt is used for passwords. Can BCrypt be reversed?  
*No. BCrypt is a one-way hash function. You can only verify by rehashing the input and comparing — never decrypt.*

**58.** If a product is in cart and someone else buys the last unit, what happens?  
*When checkout is called, `CheckoutService` validates stock. If stock < requested quantity, it throws `RuntimeException("Insufficient stock for...")`. The transaction rolls back.*

**59.** Can two payment links have the same UUID?  
*Practically impossible. UUID v4 has 2^122 possible values. Collision probability is astronomically low. No database uniqueness constraint enforces this though.*

**60.** Why does `DashboardController` use `PaymentLinkService` instead of `TransactionRepository` directly?  
*To respect the layered architecture — controllers should not bypass the service layer and access repositories directly. `PaymentLinkService.getAllTransactions()` wraps `transactionRepository.findAllByOrderByPaidAtDesc()`.*

**61.** What happens if the server restarts while a customer is on the payment page?  
*The JWT `SECRET_KEY` is regenerated on restart. The customer's stored token becomes invalid. Next request will fail validation in JwtFilter. The customer would need to log in again.*

**62.** You said there are no protected routes in the frontend. How would you add them?  
*Create a `PrivateRoute` component that checks `localStorage.getItem("token")`. If no token, redirect to `/login`. Wrap dashboard routes with this component.*

**63.** Can the merchant see other merchants' data?  
*Yes, currently — because the backend doesn't filter by merchantId. `productRepository.findAll()` returns all products from all merchants. This is a known limitation.*

**64.** What happens if the MySQL database is down when the Spring Boot app starts?  
*Spring Boot fails to start with a `DataSource` connection error. The application won't run without a database connection.*

**65.** Why is `String` returned from login instead of a JSON object?  
*`AuthService.login()` returns either an error string or a JWT string. The frontend uses `response.text()` to read it. A better approach would be returning `{ token: "...", user: {...} }` as JSON.*

---

## Architecture Questions

**66.** Why was a layered architecture (Controller → Service → Repository) chosen?  
*Separation of concerns: Controllers handle HTTP, Services handle business logic, Repositories handle database. Each layer is independently testable and maintainable.*

**67.** Why is there no service layer for Products and Orders?  
*`ProductController` and `OrderController` directly inject repositories. This violates the layered pattern and is a design inconsistency — acceptable for a small fresher project but should be fixed.*

**68.** How would you structure this project if it needed to handle 10,000 transactions per day?  
*Add caching (Redis), database indexing on `link_id` and `paid_at`, pagination for all list APIs, async processing for non-critical operations, and potentially a message queue for payment notifications.*

**69.** Why is the frontend and backend in the same repository?  
*Monorepo approach — simpler for a small project. For larger teams, they'd be in separate repos with independent CI/CD pipelines.*

**70.** What is the difference between REST and GraphQL? Why is REST used here?  
*REST uses fixed endpoints for resources. GraphQL uses a single endpoint with flexible queries. REST is simpler to implement and widely understood — appropriate for this project's scale.*

---

## Database Questions

**71.** Why doesn't the project use `@ManyToOne` / `@OneToMany` JPA relationships?  
*The developer chose to store IDs as plain `Long` fields instead of JPA relationships. This avoids N+1 query problems and lazy-loading issues — at the cost of losing automatic joins.*

**72.** What index would you add to improve query performance?  
*Add index on `transaction.paid_at` (for sorted queries), `payment_link.link_id` (for UUID lookups), `users.email` (already UNIQUE which creates an index).*

**73.** What is `ddl-auto=update`? Is it safe for production?  
*It auto-creates or alters tables on startup. NOT safe for production — can cause data loss if entities change. Production should use `validate` or migration tools like Flyway/Liquibase.*

**74.** How would you add a timestamp for when an order was created?  
*Add `LocalDateTime createdAt` to the Order entity and set it in service: `order.setCreatedAt(LocalDateTime.now())`.*

**75.** Why is `payment_link_id` stored as a VARCHAR (UUID string) in orders instead of the numeric `id`?  
*The `linkId` is the UUID used in URLs (`/pay/{linkId}`). Storing it directly allows the URL's linkId to be used as a FK reference without looking up the numeric id.*

---

## API Questions

**76.** What HTTP status code does `addProduct` return on success?  
*HTTP 201 Created — using `new ResponseEntity<>(savedProduct, HttpStatus.CREATED)`.*

**77.** What does `DELETE /api/products/{id}` return?  
*HTTP 204 No Content — `new ResponseEntity<>(HttpStatus.NO_CONTENT)`.*

**78.** Why does `POST /api/pay/{linkId}` use `@RequestParam` for method instead of `@RequestBody`?  
*`method` is a simple string — adding it as a query parameter (`?method=UPI`) avoids creating a request body class for a single value.*

**79.** Why does `DashboardController.getSummary()` return `Map<String, Object>` instead of a dedicated DTO?  
*Quick implementation — avoids creating a separate SummaryDTO class. The tradeoff is less type safety. A dedicated DTO would be cleaner.*

**80.** How are binary responses (QR code images) returned from Spring Boot?  
*`ResponseEntity<byte[]>` with `.contentType(MediaType.IMAGE_PNG)` — sets the Content-Type header and returns raw bytes. The browser or client renders it as an image.*

---

## React Questions

**81.** Why are there no protected routes in the React app?  
*Not implemented. Any user can visit `/dashboard` by typing the URL. The backend currently allows all requests too. Adding a PrivateRoute wrapper component is a future improvement.*

**82.** What is the purpose of `main.jsx`?  
*The entry point. Calls `ReactDOM.createRoot(document.getElementById("root")).render(<App />)` to mount the React app into the HTML document.*

**83.** Why is `useEffect` with `[]` used for fetching data?  
*Empty dependency array means "run once after first render." This is equivalent to `componentDidMount` in class components. The API call fires once when the page loads.*

**84.** What would happen if you didn't use `useContext` and wanted to pass auth data everywhere?  
*You'd have to pass the token/user as props from App.jsx down through every component — called "prop drilling." Context API eliminates this.*

**85.** How does the shopping cart count badge work in Shop.jsx?  
*`const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)` — sums all quantities in the cart array from `CartContext`. Displayed as a badge on the "View Cart" button.*

---

## Spring Boot Questions

**86.** What is the difference between `@Bean` in a `@Configuration` class and `@Component`?  
*`@Bean` is used on methods inside `@Configuration` classes — you control object creation. `@Component` is on classes — Spring controls instantiation.*

**87.** What is the embedded server in Spring Boot?  
*Apache Tomcat — embedded by default in `spring-boot-starter-web`. No separate server installation needed.*

**88.** What is the difference between `findById()` and a custom `findByLinkId()`?  
*`findById()` searches by the primary key (`id` column). `findByLinkId()` searches by the `link_id` column — a custom query derived from the method name.*

**89.** How does Spring Boot find all the beans at startup?  
*`@SpringBootApplication` includes `@ComponentScan` which scans all classes in `com.merchantpay.app` and its sub-packages for `@Component`, `@Service`, `@Repository`, `@Controller` annotations.*

**90.** What is `ResponseEntity` and why is it used in ProductController?  
*`ResponseEntity` wraps the response body + HTTP status code. Allows explicitly setting `201 CREATED`, `204 NO_CONTENT`, `500 INTERNAL_SERVER_ERROR` instead of always returning 200.*

---

## Security Questions

**91.** How long is the JWT valid? What happens after it expires?  
*24 hours. After expiry, `validateToken()` throws a `JwtException` caught by the try-catch, returning `false`. The filter doesn't set authentication — the request is treated as unauthenticated.*

**92.** Is the JWT secret key secure?  
*Currently no — the key is generated in-memory at startup (`Keys.secretKeyFor(HS256)`). It changes every restart. For production: load from environment variables or a secrets manager.*

**93.** What is HMAC-SHA256?  
*Hash-based Message Authentication Code using SHA-256. Used to sign the JWT. The signature ensures no one can tamper with the token payload without knowing the secret key.*

**94.** What is the difference between authentication and authorization?  
*Authentication: Who are you? (login, JWT verification). Authorization: What can you do? (merchant can only see their own data). This project implements authentication but not authorization.*

**95.** How would you add role-based access control?  
*Add a `role` field to User entity. Include roles in JWT claims. In SecurityConfig, use `.hasRole("MERCHANT")` or `.hasAuthority("ADMIN")` for specific endpoints.*

---

## "What If" Questions

**96.** What if you replaced MySQL with PostgreSQL?  
*Change `mysql-connector-j` dependency to `postgresql` in pom.xml, update `spring.datasource.url` to PostgreSQL format, change dialect to `PostgreSQLDialect`. JPA code remains unchanged.*

**97.** What if JWT was replaced with session-based auth?  
*Remove JwtFilter, use Spring Security's default form login + HttpSession. Add `@EnableWebSecurity` session config. Remove `STATELESS` policy. Cookies would handle session.*

**98.** What if React was replaced with Angular?  
*The backend REST API would remain unchanged. Angular would replace React components, TypeScript instead of JSX, Angular's HttpClient instead of Fetch/Axios, Angular routing instead of React Router.*

**99.** What if Axios was removed and only Fetch was used?  
*Replace `axios.get()` with `fetch()` calls, manually parse JSON with `res.json()`, add manual error handling. Functionally equivalent but slightly more verbose.*

**100.** What if the database goes down mid-checkout?  
*`@Transactional` would detect the failure and roll back any partial changes. Spring would throw a `DataAccessException`. The frontend would receive a 500 error and show "Checkout Failed".*

---

## Bonus Questions

**101.** What is Vite and why is it better than Create React App?  
*Vite is a modern build tool using native ES modules. It starts the dev server in milliseconds (vs seconds for CRA) and supports hot module replacement. Much faster development experience.*

**102.** What is Lucide React?  
*A React icon library with clean SVG icons. Used everywhere in the UI: `ArrowRight`, `ShoppingCart`, `Lock`, etc. Tree-shakeable — only imports icons you use.*

**103.** What is qrcode.react?  
*A React component that renders a QR code canvas directly in the browser from any string. Used in `PaymentLink.jsx` to show the payment URL as a scannable QR.*

**104.** What is `Recharts`?  
*A React charting library built on top of D3.js. Used for the `PieChart` (donut chart) on Overview and Analytics pages. Components like `PieChart`, `Pie`, `Cell`, `Tooltip` are composed declaratively.*

**105.** What is Framer Motion?  
*A React animation library. Installed in this project but only partially used — CSS Tailwind custom animations (`animate-fadeIn`, `animate-float`) handle most animations instead.*

---

# SECTION 17 — 2-MINUTE PROJECT EXPLANATION

> Use this in the opening of every interview.

---

"I have built a full-stack payment management application called **MerchantPay**. It is designed for small business owners and freelancers who need a simple way to collect payments from customers.

The project has two parts. The **frontend** is built with **React 19** using Vite as the build tool, and **Tailwind CSS** for styling. The **backend** is built with **Spring Boot 3.3.5** using **Java 17**, and the data is stored in a **MySQL** database.

Here is how the application works: A merchant registers on the platform and logs in. After login, they get a **JWT token** which is stored in their browser's localStorage. They can then go to their dashboard and create a **payment link** — the backend generates a unique UUID-based URL. They can share this link or its **QR code** with a customer. The customer opens the link, selects UPI or Card as their payment method, and clicks Pay. The backend records this as a **Transaction** and marks the payment link as PAID. The merchant can instantly see this in their dashboard — the transaction appears in the recent activity section with the amount, method, and status.

Additionally, the project has an **inventory management** feature where merchants can add and manage products. Customers can browse these in a **marketplace**, add items to a **cart**, and checkout — which creates an **order** linked to a payment link.

I have also implemented a **Demo Mode** where the entire application can be explored without a backend running — it uses localStorage as mock data.

The main technologies I used are React, Spring Boot, MySQL, JWT for authentication, BCrypt for password hashing, and Google ZXing for QR code generation."

---

# SECTION 18 — 5-MINUTE DEEP PROJECT EXPLANATION

> Use this when asked "Tell me more about your project."

---

"Let me walk you through MerchantPay in more detail.

**The Problem I Solved:**
Small merchants often struggle to collect digital payments quickly. They don't want to spend weeks integrating complex payment gateways. MerchantPay gives them a simple way — create a payment link in seconds, share the QR code or URL, and receive the payment.

**Frontend Architecture:**
The frontend is a Single Page Application built with React 19 and Vite. I used Vite because it's significantly faster than Create React App for development. The routing is handled by React Router DOM v7 — I have public routes like `/login`, `/register`, `/pay/:linkId`, and nested protected routes under `/dashboard`.

For styling, I used Tailwind CSS v3. But instead of just using utility classes everywhere, I created a custom design system in `index.css` with reusable class names like `.card`, `.btn-primary`, `.input-premium`. This gives the app a consistent dark, glassmorphism look across all pages.

For global state management, I used React's Context API with three contexts — AuthContext for authentication state and JWT token, CartContext for shopping cart management, and a RealtimeContext as a placeholder for future WebSocket integration.

The API calls are made using both Fetch API — for authentication and payment modules — and Axios — for product and order management. I separated all API functions into dedicated files: `authApi.js`, `paymentApi.js`, and `analyticsApi.js`, keeping concerns separated.

**Backend Architecture:**
The backend follows a clean layered architecture. Controllers handle HTTP requests, Services contain business logic, and Repositories handle database operations via Spring Data JPA.

I have 8 controllers — AuthController, PaymentController, PaymentLinkController, ProductController, DashboardController, OrderController, CheckoutController, and TransactionController. Each controller is mapped to a specific base URL like `/api/auth` or `/api/products`.

The most complex service is `CheckoutService` — it is annotated with `@Transactional`, which ensures that stock deduction, order creation, order item creation, and payment link generation all happen atomically. If any step fails, all changes roll back.

**Authentication:**
I implemented JWT-based authentication. When a merchant logs in, `AuthService` verifies credentials using BCrypt's `passwordEncoder.matches()` method — passwords are never stored plain. If valid, `JwtUtil.generateToken()` creates a signed JWT using HMAC-SHA256 with a 24-hour expiry. The frontend stores this token in localStorage and sends it in the `Authorization: Bearer <token>` header on subsequent requests.

On the backend, `JwtFilter extends OncePerRequestFilter` intercepts every request, extracts the token, validates it, and sets the authentication in `SecurityContextHolder`. Spring Security then allows the request.

**QR Code Generation:**
I used Google ZXing library on the backend. The `QrCodeService.generateQR()` method encodes the payment URL into a 250x250 QR code using `QRCodeWriter`, converts it pixel by pixel into a `BufferedImage`, and returns it as PNG bytes. The controller returns it with `MediaType.IMAGE_PNG`. On the frontend, I also use the `qrcode.react` library to render QR codes directly in the browser.

**Database:**
MySQL has 6 tables: users, product, orders, order_items, payment_link, and transaction. Relationships are stored as plain ID fields — I deliberately avoided JPA `@ManyToOne` annotations to keep queries simple and avoid N+1 problems.

**What I Learned:**
This project taught me how to integrate React with Spring Boot using CORS configuration, implement JWT authentication from scratch, use `@Transactional` for data integrity, generate binary resources like QR codes from an API, and structure a full-stack project with clean separation of concerns."

---

# SECTION 19 — TECHNOLOGY CHOICES EXPLAINED

## React
**Why chosen:** Component-based architecture makes UI reusable and maintainable. State and lifecycle management with hooks. Huge ecosystem and industry adoption.  
**Alternatives:** Angular (more opinionated, TypeScript-first), Vue.js (simpler learning curve), plain HTML/JS (no component reuse).  
**Advantages:** Virtual DOM for efficient rendering, reusable components, large community, Context API for state management.  
**Disadvantages:** Not a full framework — requires additional libraries for routing (React Router), state (Context/Redux), etc.

## Spring Boot
**Why chosen:** Auto-configuration removes boilerplate. Embedded Tomcat server — no separate setup. Spring Security and JPA integration. Java is strongly typed and OOP-friendly.  
**Alternatives:** Node.js + Express (JavaScript), Django (Python), Laravel (PHP), FastAPI (Python).  
**Advantages:** Production-ready features, extensive ecosystem, dependency injection, powerful security.  
**Disadvantages:** Heavier startup time than Node.js, more verbose than Python frameworks, steeper learning curve.

## MySQL
**Why chosen:** Relational data fits perfectly — users have products, orders have items, payment links link to orders. Spring Data JPA + Hibernate integrate seamlessly.  
**Alternatives:** PostgreSQL (more features, open-source), MongoDB (NoSQL, flexible schema), H2 (in-memory for testing).  
**Advantages:** ACID compliance, wide support, free, Hibernate auto DDL management.  
**Disadvantages:** Less flexible schema than NoSQL, horizontal scaling requires more effort.

## JWT (JSON Web Token)
**Why chosen:** Stateless — server doesn't need to store sessions. Scalable — any server instance can validate any token. Easy to implement with JJWT library.  
**Alternatives:** Session-based auth (server stores session), OAuth 2.0 (for third-party login), API keys.  
**Advantages:** Stateless, compact, carries payload (email), no DB lookup needed for validation.  
**Disadvantages:** Cannot invalidate before expiry, secret key management is critical, larger than session cookies.

## Maven
**Why chosen:** Industry-standard Java build tool. `pom.xml` declaratively defines all dependencies. Spring Boot Maven Plugin creates executable JAR.  
**Alternatives:** Gradle (more concise, uses Groovy/Kotlin DSL), Ant (older).  
**Advantages:** Standardized project structure, dependency management, IDE integration.  
**Disadvantages:** XML-based (verbose), slower than Gradle for large projects.

## Tailwind CSS
**Why chosen:** Rapid UI development without writing separate CSS files. Utility classes in JSX keep styles co-located with markup.  
**Alternatives:** Bootstrap (pre-designed components), Material UI (React component library), plain CSS, Styled Components.  
**Advantages:** No unused CSS in production (purging), highly customizable, consistent design tokens.  
**Disadvantages:** Long class strings in JSX, learning curve for utility classes, requires PostCSS setup.

## BCrypt
**Why chosen:** Purpose-built for password hashing. Adapts work factor to remain slow against brute-force as hardware improves.  
**Alternatives:** Argon2 (winner of Password Hashing Competition), PBKDF2, SHA-256 (NOT suitable for passwords).  
**Advantages:** Automatic salting, work factor adjustable, industry standard.  
**Disadvantages:** Deliberately slow (intended) — not suitable for encrypting non-passwords.

## Google ZXing (QR Code)
**Why chosen:** Mature, battle-tested library for QR code generation and reading in Java. Free and open-source.  
**Alternatives:** QRGen (wrapper around ZXing), online QR API services.  
**Advantages:** No external API call needed, runs entirely on server, fast.  
**Disadvantages:** Generates basic black/white QR; branded/colored QR needs additional processing.

## Axios
**Why chosen:** Simpler API than Fetch — automatic JSON parsing, request/response interceptors, better error handling.  
**Alternatives:** Fetch API (native), `ky`, `superagent`.  
**Advantages:** Auto JSON parsing, request cancellation, interceptors for adding auth headers globally.  
**Disadvantages:** External dependency (Fetch is built into browsers).

## Recharts
**Why chosen:** React-native chart components that work directly with state — no DOM manipulation. Declarative API.  
**Alternatives:** Chart.js + react-chartjs-2, D3.js (lower level), Victory, ApexCharts.  
**Advantages:** Pure React approach, composable components, good documentation.  
**Disadvantages:** Less customizable than D3.js for complex visualizations.

---

# SECTION 20 — COMMON INTERVIEW TRAPS

### Trap 1: "Is your application secure?"
**Dangerous answer:** "Yes, it uses JWT."  
**Smart answer:** "The authentication uses JWT with BCrypt password hashing, which is good. However, I'm aware of some limitations — the JWT secret key regenerates on restart which invalidates all tokens, the frontend stores tokens in localStorage which is vulnerable to XSS (cookies with HttpOnly would be safer), and the backend currently permits all `/api/**` routes so authorization isn't enforced. These are improvements I would make in production."

### Trap 2: "What happens if two users register with the same email?"
**Answer:** "The `users` table has a UNIQUE constraint on the email column. Additionally, `AuthService.register()` explicitly checks `userRepository.findByEmail(email).isPresent()` before saving and returns 'Email already registered' if found. So it's handled at both the application and database level."

### Trap 3: "You use `@Transactional` in CheckoutService. What if the payment link creation fails but the order was already created?"
**Answer:** "Since the entire `checkout()` method is `@Transactional`, any `RuntimeException` thrown anywhere in the method will cause Spring to roll back ALL database changes — including the order, order items, and stock deductions. The database returns to its original state. The customer would need to retry."

### Trap 4: "Your API returns plain strings for login. Is that good practice?"
**Answer:** "No, that's a limitation of this implementation. Best practice is to return a JSON object like `{ "token": "jwt...", "message": "Login successful" }`. Currently the frontend uses `response.text()` instead of `response.json()` to handle both the error string and the JWT token in the same response — not ideal but functional for a fresher project."

### Trap 5: "Why do you use both Fetch and Axios? That's inconsistent."
**Answer:** "You're right, it's a design inconsistency. Auth and payment APIs use Fetch in dedicated API files, while Shop, Cart, and Merchant components use Axios inline. For production, I would standardize on one approach — probably Axios with interceptors to automatically attach the JWT header to all requests."

### Trap 6: "Can a merchant see another merchant's products?"
**Answer:** "Yes, currently that's a limitation. `productRepository.findAll()` returns all products from all merchants. Proper implementation would filter by `merchantId` matching the authenticated user's ID. The JWT contains the email, which could be used to look up the user's ID and filter accordingly."

### Trap 7: "You said the frontend has no route guards. How does the dashboard stay secure?"
**Answer:** "Honestly, it doesn't have frontend route protection right now. A user can manually type `/dashboard` and access it without logging in. The fix is to create a `PrivateRoute` component that checks `localStorage.getItem('token')` — if no token, redirect to `/login`. However, since frontend routes can be bypassed anyway, the real security should be on the backend API — which also needs better authorization."

### Trap 8: "What is the difference between `findById()` returning `Optional<Order>` and your custom `findByPaymentLinkId()` returning `Order` directly?"
**Answer:** "Good catch. Spring-derived queries that can return null should return `Optional<>`. `findByPaymentLinkId()` returns a plain `Order` which will be `null` if not found — this can cause NullPointerExceptions if not handled carefully. It's better practice to return `Optional<Order>` and use `.orElseThrow()` or `.orElse(null)` explicitly, which is what `findById` does correctly."

### Trap 9: "What is the 'N+1 query problem' and do you have it in your project?"
**Answer:** "N+1 problem occurs when loading a list of entities causes N additional queries to fetch related entities. In this project, I avoided it by using plain ID fields instead of JPA `@ManyToOne` relationships — there are no lazy-loaded associations that could trigger N+1. However, this means I lose the convenience of automatic joins."

### Trap 10: "If you had to scale this for 1 million users, what would you change?"
**Answer:** "Several things: Add Redis for session/token caching, add database connection pooling (HikariCP — already default in Spring Boot), add indexes on frequently queried columns (link_id, email, paid_at), implement pagination for all list APIs, consider read replicas for the database, add a CDN for static assets, containerize with Docker for horizontal scaling, and use a proper secrets manager for JWT keys."

---

*End of Document — Based entirely on actual MerchantPay source code.*
*Generated: July 2026*

# Domain Price Checker

A Next.js application for comparing domain registration prices across different registrars, similar to tldes.com.

## Features

- **Responsive Design**: Works on both desktop and mobile devices
- **Real-time Price Comparison**: Compare prices from multiple registrars
- **Clean UI**: Modern, responsive interface built with Tailwind CSS
- **MySQL Database**: Stores domain pricing data
- **Adminer Integration**: Web-based database administration tool

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: MySQL 8.0
- **Development**: Docker Compose for MySQL and Adminer

## Getting Started

### Prerequisites

- Node.js 18+ 
- Docker and Docker Compose

### Installation

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Start MySQL and Adminer with Docker**:
   ```bash
   docker-compose up -d
   ```

3. **Access Adminer**:
   - Open http://localhost:8081
   - Server: db
   - Username: domain_user
   - Password: domain_password
   - Database: domain_pricing

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open the application**:
   - Navigate to http://localhost:3000

### Database Setup

The database is automatically configured with Docker Compose. The schema includes:

- **reg**: Registrars table
- **tld**: Top-level domains table
- **price**: Domain pricing data
- **promo**: Promotional codes and discounts

### Environment Variables

The project uses a `.env` file with the following configuration:

```env
DATABASE_URL="mysql://domain_user:domain_password@localhost:3307/domain_pricing"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
NODE_ENV="development"
```

### Docker Services

- **MySQL**: Runs on port 3307 (mapped to container port 3306)
- **Adminer**: Web interface available on http://localhost:8081

## Usage

1. **Search for a domain**: Enter your desired domain name and extension
2. **Compare prices**: View pricing from different registrars
3. **Choose the best deal**: Compare registration, renewal, and transfer prices

## Development

- **Hot reloading**: Enabled for both frontend and backend
- **TypeScript**: Full type safety throughout the application
- **Responsive design**: Mobile-first approach with Tailwind CSS

## API Endpoints

- `GET /api/prices?domain=<domain>&extension=<extension>`: Get pricing data for a domain

## Database Access

Access the database via Adminer at http://localhost:8081 with these credentials:
- **Server**: db
- **Username**: domain_user
- **Password**: domain_password
- **Database**: domain_pricing
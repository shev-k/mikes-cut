<div align="center">

  <h1 align="center">Mike''s Cut </h1>

  <p align="center">
    A modern, full-stack barbershop management system.<br />
    <i>University of Europer Project for Software Engineering 2</i>
  </p>

  <p align="center">
    <a href="https://mikes-cut.vercel.app/"><strong>View Live Demo </strong></a>
    <br />
    <br />
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" alt="Next.js" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" /></a>
  </p>
</div>

<br />

##  Team

| Konstantin Shevtsov | Mikhail Makarchuk | Maksim Pinchuk | Alexandr An |
| :---: | :---: | :---: | :---: |
| Developer | Developer | Developer | Developer |

##  Features

###  For Customers
*   **Online Booking**: Seamless appointment scheduling.
*   **Shop**: Browse & buy grooming products.
*   **Guest Checkout**: No account required.

###  For Barbers
*   **Barber Dashboard**: Personal schedule & earnings overview.
*   **Calendar**: Interactive drag-and-drop management.
*   **Analytics**: Revenue tracking & top services stats.

###  For Admins
*   **Master Control**: Shop-wide performance monitoring.
*   **Reporting**: Exportable CSV revenue reports.
*   **Management**: Full CRUD for products, services, and staff.

##  Tech Stack

*   **Framework**: Next.js 14 (App Router)
*   **Database**: Supabase (PostgreSQL + Auth)
*   **Styling**: Tailwind CSS + shadcn/ui
*   **Analytics**: Recharts
*   **Email**: Resend (Mocked)

##  Getting Started

### Prerequisites
*   Node.js 18+
*   Supabase Account

### Setup

1.  **Clone**
    ```bash
    git clone https://github.com/shev-k/mikes-cut/
    cd mikes-cut
    ```

2.  **Install**
    ```bash
    npm install
    ```

3.  **Environment**
    Create `.env.local`:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_url
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_key
    ```

4.  **Run**
    ```bash
    npm run dev
    ```

##  Structure

*   `app/` - Pages & Actions
*   `components/` - UI Building Blocks
*   `lib/` - Utilities

---

<p align="center">
  Built with ❤️ by the Mike''s Cut Team
</p>

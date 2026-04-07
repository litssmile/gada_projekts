
  # Student Day Off Reservation Site

  This is a code bundle for Student Day Off Reservation Site. The original project is available at https://www.figma.com/design/hi0vI5Hp75OXbfqPyJM3oB/Student-Day-Off-Reservation-Site.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  
## Backend (PHP)

Šim projektam pievienots vienkāršs PHP+MySQL backend `backend/` mapītē.

1) Importē `backend/schema.sql` savā MySQL.
2) Iestati DB datus `backend/config.php`.
3) Publicē `backend/` uz lokālā web servera (XAMPP/Laragon).
4) Frontendam izveido `.env` (var kopēt no `.env.example`) un iestati `VITE_API_BASE` uz backend adresi.

Backend endpointi ir `backend/api/` mapītē.

import { Container } from "@mui/material";
import { Hlavicka } from "./components/Hlavicka";
import { Hero } from "./components/Hero";
import { OProjektu } from "./components/OProjektu";
import { Autori } from "./components/Autori";
import { Plan } from "./components/Plan";
import { Vytvory } from "./components/Vytvory";
import { Denik } from "./components/Denik";
import { Paticka } from "./components/Paticka";

export function App() {
  return (
    <>
      <Hlavicka />
      <Hero />
      <Container maxWidth="md" component="main">
        <OProjektu />
        <Autori />
        <Plan />
        <Vytvory />
        <Denik />
      </Container>
      <Paticka />
    </>
  );
}

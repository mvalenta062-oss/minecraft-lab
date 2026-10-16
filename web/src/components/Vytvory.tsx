import { Box, Button, Chip, Grid, Link, Paper, Stack, SvgIcon, Tooltip, Typography } from "@mui/material";
import { PROJEKTY } from "../data";
import type { Projekt } from "../data";
import { useState } from "react";
import { ReceptDialog } from "./ReceptDialog";
import { PodrobnostiDialog } from "./PodrobnostiDialog";
import { Sekce } from "./Sekce";
import { StavChip } from "./StavChip";
import { barvy } from "../theme";

export function Vytvory() {
  const [receptProjekt, nastavReceptProjekt] = useState<Projekt | null>(null);
  const [detailProjekt, nastavDetailProjekt] = useState<Projekt | null>(null);
  return (
    <Sekce id="vytvory" nadpis="Výtvory">
      <Box
        component="aside"
        aria-labelledby="navod-doplnky"
        sx={{
          mb: 3,
          p: 2.5,
          border: "1px solid",
          borderColor: "divider",
          borderLeft: `3px solid ${barvy.patina}`,
          bgcolor: "rgba(92, 156, 130, 0.04)",
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
          <Box
            aria-hidden="true"
            sx={{
              width: 24,
              height: 24,
              border: "1px solid",
              borderColor: "secondary.main",
              borderRadius: "50%",
              textAlign: "center",
              color: "secondary.main",
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            ?
          </Box>
          <Typography id="navod-doplnky" variant="h3">
            Jak doplněk použiju?
          </Typography>
        </Stack>
        <Box
          component="ol"
          sx={{ m: 0, pl: 3, color: "text.secondary", "& li": { mb: 0.75 }, "& li:last-child": { mb: 0 } }}
        >
          <li>
            <strong>Stáhni doplněk.</strong> Klikni na Stáhnout a otevři soubor v Minecraft Bedrock. Počkej, až hra
            dokončí import.
          </li>
          <li>
            <strong>Přidej doplněk do světa.</strong> Doplněk může mít dvě části: chování (co dělá) a vzhled (jak
            vypadá). V nastavení světa otevři Balíčky chování → Moje balíčky, najdi doplněk a klikni na Aktivovat. Pokud
            má i část pro vzhled, otevři Balíčky prostředků a zkontroluj ji v seznamu Aktivní. Když tam není, aktivuj ji
            také v Moje balíčky.
          </li>
          <li>
            <strong>Vyber si způsob hraní.</strong> V kreativním režimu otevři inventář a u lupy napiš název výtvoru.
            Doplněk označený Přežití můžeš získat i běžným hraním — pokud má recept, nasbírej suroviny a vyrob ho podle
            něj. U doplňku otevři tlačítko Recept se symbolem pracovního stolu.
          </li>
          <li>
            <strong>A jdeme hrát!</strong> Kostičku přesuň do spodní lišty a polož ji do světa. Brnění si obleč do
            odpovídajícího políčka v inventáři.
          </li>
        </Box>
      </Box>

      <Grid container spacing={2.5}>
        {PROJEKTY.map((p) => (
          <Grid key={p.nazev} size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 2.5, height: "100%", display: "flex", flexDirection: "column" }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                {p.nahled && (
                  <Box
                    component="img"
                    src={p.nahled}
                    alt={`Náhled: ${p.nazev}`}
                    sx={{ width: 72, height: 72, flexShrink: 0, imageRendering: "pixelated", borderRadius: 1 }}
                  />
                )}
                <Box>
                  <Typography variant="h4" sx={{ color: barvy.lampa, mb: 1 }}>
                    {p.nazev}
                  </Typography>
                  <StavChip stav={p.stav} />
                  {(p.podrobnosti || p.recept) && (
                    <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
                      {p.podrobnosti && (
                        <Button
                          size="small"
                          variant="text"
                          onClick={() => nastavDetailProjekt(p)}
                          aria-haspopup="dialog"
                          aria-label={`Podrobnosti: ${p.nazev}`}
                          startIcon={
                            <SvgIcon viewBox="0 0 16 16" sx={{ fontSize: 20 }} aria-hidden="true">
                              <path fill="#68442b" d="M1 2h6l1 1 1-1h6v12H9l-1 1-1-1H1z" />
                              <path fill="#e6d2a6" d="M2 1h4l2 2 2-2h4v11h-4l-2 1-2-1H2z" />
                              <path
                                fill="#bc8751"
                                d="M7 3h2v10H7zM3 4h3v1H3zm0 3h3v1H3zm0 3h3v1H3zm7-6h3v1h-3zm0 3h3v1h-3zm0 3h3v1h-3z"
                              />
                            </SvgIcon>
                          }
                          sx={{
                            p: "2px 6px",
                            minWidth: 0,
                            minHeight: 32,
                            fontSize: "0.85rem",
                            color: "text.secondary",
                            border: 0,
                            boxShadow: "none",
                            "&:active": { transform: "none", boxShadow: "none" },
                          }}
                        >
                          Podrobnosti
                        </Button>
                      )}
                      {p.recept && (
                        <Tooltip title="Jak vyrobit: recept na pracovním stole">
                          <Button
                            size="small"
                            variant="text"
                            onClick={() => nastavReceptProjekt(p)}
                            aria-haspopup="dialog"
                            aria-label={`Recept: ${p.nazev}`}
                            startIcon={
                              <SvgIcon viewBox="0 0 16 16" sx={{ fontSize: 20 }} aria-hidden="true">
                                <path fill="#68442b" d="M1 5h14v10H1z" />
                                <path fill="#bc8751" d="M1 1h14v5H1z" />
                                <path fill="#593b26" d="M5 1h1v5H5zm5 0h1v5h-1zM1 3h14v1H1zM3 7h2v8H3zm8 0h2v8h-2z" />
                                <path fill="#d5ad72" d="M6 7h4v5H6z" />
                              </SvgIcon>
                            }
                            sx={{
                              p: "2px 6px",
                              minWidth: 0,
                              minHeight: 32,
                              fontSize: "0.85rem",
                              color: "text.secondary",
                              border: 0,
                              boxShadow: "none",
                              "&:active": { transform: "none", boxShadow: "none" },
                            }}
                          >
                            Recept
                          </Button>
                        </Tooltip>
                      )}
                    </Stack>
                  )}
                </Box>
              </Stack>
              <Typography color="text.secondary" sx={{ flex: 1 }}>
                {p.popis}
              </Typography>
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                justifyContent="center"
                useFlexGap
                flexWrap="wrap"
                sx={{ mt: 2 }}
              >
                {p.platformy?.map(({ platforma, overeno }) => {
                  const popisek = `${platforma === "windows" ? "Windows" : "iPad"}: ${overeno ? "ověřeno ve hře" : "zatím neověřeno"}`;
                  return (
                    <Tooltip key={platforma} title={popisek}>
                      <Box
                        component="span"
                        tabIndex={0}
                        role="img"
                        aria-label={popisek}
                        sx={{ display: "inline-flex", color: overeno ? "secondary.main" : "text.secondary" }}
                      >
                        <SvgIcon aria-hidden="true" sx={{ fontSize: 23 }}>
                          {platforma === "windows" ? (
                            <path d="M3 5l8-1v8H3V5zm10-1l8-1v9h-8V4zM3 14h8v7l-8-1v-6zm10 0h8v9l-8-1v-8z" />
                          ) : (
                            <path d="M6 2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zm0 2v15h12V4H6zm5 16v1h2v-1h-2z" />
                          )}
                        </SvgIcon>
                      </Box>
                    </Tooltip>
                  );
                })}
                {p.rezimy?.map((rezim) => (
                  <Tooltip
                    key={rezim}
                    title={
                      rezim === "creative"
                        ? "Dostupné v kreativním inventáři"
                        : "Získáš i v přežití, například podle receptu"
                    }
                  >
                    <Chip
                      size="small"
                      variant="outlined"
                      label={rezim === "creative" ? "Kreativní" : "Přežití"}
                      sx={{
                        fontFamily: "inherit",
                        fontSize: "0.75rem",
                        fontWeight: 400,
                        color: "text.secondary",
                        borderColor: "divider",
                      }}
                    />
                  </Tooltip>
                ))}
                {p.odkazZdroj && (
                  <Tooltip title="Zdrojové soubory">
                    <Link
                      href={p.odkazZdroj}
                      aria-label={`Zdrojové soubory: ${p.nazev}`}
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: 32,
                        minHeight: 32,
                        color: "text.secondary",
                      }}
                    >
                      <SvgIcon viewBox="0 0 24 24" aria-hidden="true" sx={{ fontSize: 23 }}>
                        <path
                          fill="currentColor"
                          d="M22.5 10.6 13.4 1.5a2 2 0 0 0-2.8 0L8.7 3.4l2.4 2.4a2 2 0 0 1 2.5 2.5l2.3 2.3a2 2 0 1 1-1.4 1.4l-2.1-2.1v5.5a2 2 0 1 1-2 0V9.1a2 2 0 0 1-.7-2L7.3 4.8l-5.8 5.8a2 2 0 0 0 0 2.8l9.1 9.1a2 2 0 0 0 2.8 0l9.1-9.1a2 2 0 0 0 0-2.8Z"
                        />
                      </SvgIcon>
                    </Link>
                  </Tooltip>
                )}
              </Stack>
              <Stack
                direction="row"
                useFlexGap
                flexWrap="wrap"
                spacing={2}
                alignItems="center"
                justifyContent="center"
                sx={{ mt: 2, fontWeight: 700 }}
              >
                {p.odkazStazeni && (
                  <Button component="a" href={p.odkazStazeni} variant="contained" sx={{ whiteSpace: "nowrap" }}>
                    Stáhnout
                  </Button>
                )}
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <ReceptDialog projekt={receptProjekt} zavrit={() => nastavReceptProjekt(null)} />
      <PodrobnostiDialog projekt={detailProjekt} zavrit={() => nastavDetailProjekt(null)} />
    </Sekce>
  );
}

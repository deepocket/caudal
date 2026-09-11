// Fictional records for the product demos. Names, folios, lots and amounts are
// invented: never copy real clients, doctors or patients from ArtroConfort here.

export const demoClients = [
  { name: "Dr. Andrés Villaseñor", company: "Ortopedia Villaseñor" },
  { name: "Clínica del Parque", company: "Servicios Médicos del Parque" },
  { name: "Hospital San Rafael", company: "Hospitalaria San Rafael" },
  { name: "Dra. Mariana Treviño", company: "Artroscopía Treviño" },
  { name: "Centro Quirúrgico Norte", company: "CQN Salud" },
  { name: "Distribuidora Médica Central", company: "DMC Insumos" },
] as const;

export const demoProducts = [
  { ref: "AR-9401", name: "Punta de radiofrecuencia 90°", lot: "L24A117" },
  { ref: "SH-4020", name: "Cuchilla de shaver 4.0 mm", lot: "L25C042" },
  { ref: "AN-5501", name: "Ancla de sutura 5.5 mm", lot: "L25B310" },
  { ref: "CN-0808", name: "Cánula de artroscopía 8 mm", lot: "L24K905" },
  { ref: "BT-7700", name: "Batería de sistema motorizado", lot: "SN 7700-2291" },
] as const;

export const demoTeam = [
  { initials: "BD", name: "Braulio" },
  { initials: "AL", name: "Ana" },
  { initials: "JM", name: "Jorge" },
] as const;

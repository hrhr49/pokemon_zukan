import React from "react";
import { Chart } from "chart.js";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import type { PokemonStatus } from "./types";

Chart.defaults.plugins.legend.display = false;

const PokemonStatusGraph: React.FC<{ status: PokemonStatus }> = ({
  status: { hp, attack, defense, specialAttack, specialDefense, speed },
}) => {
  const options = {
    indexAxis: "y" as const,
    scales: {
      x: {
        min: 0,
        max: 255,
      },
    },
  };
  const data = {
    labels: ["HP", "こうげき", "ぼうぎょ", "とくこう", "とくぼう", "すばやさ"],
    datasets: [
      {
        label: '',
        data: [hp, attack, defense, specialAttack, specialDefense, speed],
        borderWidth: 1,
      },
    ],
  };
  return <Bar options={options as any} data={data}></Bar>;
};

export default PokemonStatusGraph;

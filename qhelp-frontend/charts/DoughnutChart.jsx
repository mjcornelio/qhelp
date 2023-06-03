import React, { useRef } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart,
  DoughnutController,
  ArcElement,
  TimeScale,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-moment";

import { tailwindConfig } from "../src/utils/Utils";

Chart.register(DoughnutController, ArcElement, TimeScale, Tooltip, Legend);
export default function DoughnutChart({ data }) {
  const legend = useRef(null);
  const donutOptions = {
    cutout: "85%",
    layout: {
      padding: 24,
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  const plugins = [
    {
      id: "htmlLegend",
      afterUpdate(c, args, options) {
        const ul = legend.current;
        if (!ul) return;
        // Remove old legend items
        while (ul.firstChild) {
          ul.firstChild.remove();
        }
        // Reuse the built-in legendItems generator
        const items = c.options.plugins.legend.labels.generateLabels(c);
        items.forEach((item) => {
          const li = document.createElement("li");
          li.style.margin = tailwindConfig().theme.margin[1];
          // Button element
          const button = document.createElement("button");
          button.classList.add("btn-xs");
          button.style.backgroundColor = tailwindConfig().theme.colors.white;
          button.style.borderWidth = tailwindConfig().theme.borderWidth[1];
          button.style.borderColor = tailwindConfig().theme.colors.slate[200];
          button.style.color = tailwindConfig().theme.colors.slate[500];
          button.style.boxShadow = tailwindConfig().theme.boxShadow.md;
          button.style.opacity = item.hidden ? ".3" : "";
          button.onclick = () => {
            c.toggleDataVisibility(item.index, !item.index);
            c.update();
          };
          // Color box
          const box = document.createElement("span");
          box.style.display = "block";
          box.style.width = tailwindConfig().theme.width[2];
          box.style.height = tailwindConfig().theme.height[2];
          box.style.backgroundColor = item.fillStyle;
          box.style.borderRadius = tailwindConfig().theme.borderRadius.sm;
          box.style.marginRight = tailwindConfig().theme.margin[1];
          box.style.pointerEvents = "none";
          // Label
          const label = document.createElement("span");
          label.style.display = "flex";
          label.style.alignItems = "center";
          const labelText = document.createTextNode(item.text);
          label.appendChild(labelText);
          li.appendChild(button);
          button.appendChild(box);
          button.appendChild(label);
          ul.appendChild(li);
        });
      },
    },
  ];
  return (
    <div className=" px-10 pt-0 ">
      <div className="px-20 flex justify-center">
        <Doughnut
          data={data}
          width={389}
          height={260}
          options={donutOptions}
          plugins={plugins}
        />
      </div>
      <ul ref={legend} className="flex" style={{ flexWrap: "wrap" }}></ul>
    </div>
  );
}

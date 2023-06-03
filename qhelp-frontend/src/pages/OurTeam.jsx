import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../partials/Header";
import Cards from "../partials/Cards";
import { MdOutlineArrowBackIos } from "react-icons/md";

function OurTeam() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden mx-auto w-screen">
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden ">
        {/*  Site header */}

        <Header />

        <main
          style={{ maxWidth: "1400px " }}
          className="mx-auto relative px-20"
        >
          <div
            className="absolute top-10 -left-10 bg-slate-200 text-slate-500 p-4 rounded-3xl cursor-pointer hover:bg-slate-300 hover:text-slate-600"
            title="Back"
            onClick={() => navigate(-1)}
          >
            <MdOutlineArrowBackIos />
          </div>
          <div className="mt-8 mb-10 md:mb-10">
            <h2 className=" mb-2 text-2xl font-bold text-center text-slate-700 lg:text-3xl md:mb-2">
              Our Team
            </h2>

            <p className="max-w-screen-md mx-auto text-center text-slate-500 md:text-lg">
              Bulacan State University - Sarmiento Campus Interns
            </p>
          </div>

          <div className="grid gap-4 gap-x-20 md:grid-cols-3 ">
            <Cards
              name="Mar John Cornelio"
              role="Lead Developer"
              src="/images/Cornelio.png"
            />
            <Cards
              name="Francis Beam Santander"
              role="Designer"
              src="/images/Santander.jpg"
            />
            <Cards
              name="Kenneth Siladan"
              role="Technical Support"
              src="/images/Siladan.jpg"
            />
            <Cards name="Edward Osida" role="Technical Support" title="Ed" />
            <Cards name="Ricky Fiel" role="Technical Support" title="Rick" />
            <Cards
              name="Joshua Holgado"
              role="Technical Support"
              src="/images/Holgado.jpg"
            />
          </div>
          <div className="mt-8 mb-10 md:mb-10">
            <h2 className=" mb-2 text-2xl font-bold text-center text-slate-700 lg:text-3xl md:mb-2">
              Mentors
            </h2>

            <p className="max-w-screen-md mx-auto text-center text-slate-500 md:text-lg">
              QualiMed Hospital SJDM - IT Department
            </p>
          </div>
          <div className="grid gap-4 gap-x-20 md:grid-cols-3">
            <Cards name="Christian Quiring" role="IT Manager" title="Sir Ian" />
            <Cards name="Angelito Landicho" role="Team Lead" title="Sir Bhot" />
            <Cards name="Rey Ann Fuentes" role="IT Associate" title="Sir Rey" />
          </div>
        </main>
      </div>
    </div>
  );
}

export default OurTeam;

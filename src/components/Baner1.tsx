"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import React, { useRef } from "react";

const Baner1 = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
  });

  return (
    <section
      ref={ref}
      className="mx-auto flex h-[350vh] w-screen flex-col items-center overflow-hidden bg-gradient-to-br from-slate-100 via-sky-50 to-white px-4 text-[#1F3A4B]"
    >
      <div className="mt-42 relative flex w-fit flex-col items-center justify-center gap-5 text-center">
        <h1 className="font-jakarta-sans relative z-10 text-7xl font-medium tracking-[-0.08em] lg:text-9xl">
          Reporta <br /> Con la Alcaldía <br />
          Al Instante
        </h1>
        <p className="font-jakarta-sans relative z-10 max-w-2xl text-xl font-medium text-[#1F3A4B]">
          Desliza para descubrir cómo usar nuestra app de reportes ciudadanos
        </p>

        <LinePath
          className="absolute -right-[40%] top-0 z-0"
          scrollYProgress={scrollYProgress}
        />
      </div>

    </section>
  );
};

export default Baner1;

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  delay: number;
}

const StepCard = ({ number, title, description, delay }: StepCardProps) => {
  return (
    <motion.div
      className="w-full max-w-4xl"
      initial={{ opacity: 0, x: -100, scale: 0.9 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div
        className="rounded-2xl bg-gradient-to-r from-[#2A4A5A] to-[#1F3A4B] p-8 shadow-2xl border border-[#C2F84F]/20 backdrop-blur-sm"
        whileHover={{ 
          scale: 1.02, 
          boxShadow: "0 20px 40px rgba(194, 248, 79, 0.15)",
          borderColor: "rgba(194, 248, 79, 0.4)"
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-start gap-6">
          <motion.div 
            className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#C2F84F] text-[#1F3A4B] font-bold text-2xl shadow-lg"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            {number}
          </motion.div>
          <div className="flex-1">
            <motion.h3 
              className="mb-3 text-2xl font-bold text-[#C2F84F]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: delay + 0.2 }}
              viewport={{ once: true }}
            >
              {title}
            </motion.h3>
            <motion.p 
              className="text-lg leading-relaxed text-[#FAFDEE]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: delay + 0.4 }}
              viewport={{ once: true }}
            >
              {description}
            </motion.p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

interface LinePathProps {
  className?: string;
  scrollYProgress: MotionValue<number>;
}

const LinePath = ({
  className,
  scrollYProgress,
}: LinePathProps) => {
  const pathLength = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

  const steps = [
    { number: 1, title: "Descarga la App", description: "Busca 'Reporta Alcaldía' en las tiendas", progress: 0.15 },
    { number: 2, title: "Crea tu Cuenta", description: "Regístrate con email y teléfono", progress: 0.3 },
    { number: 3, title: "Toma una Foto", description: "Captura evidencia del problema", progress: 0.45 },
    { number: 4, title: "Describe el Problema", description: "Proporciona detalles clave", progress: 0.6 },
    
  ];

  return (
    <svg
      width="1278"
      height="2319"
      viewBox="0 0 1278 2319"
      fill="none"
      overflow="visible"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <motion.path
        d="M876.605 394.131C788.982 335.917 696.198 358.139 691.836 416.303C685.453 501.424 853.722 498.43 941.95 409.714C1016.1 335.156 1008.64 186.907 906.167 142.846C807.014 100.212 712.699 198.494 789.049 245.127C889.053 306.207 986.062 116.979 840.548 43.3233C743.932 -5.58141 678.027 57.1682 672.279 112.188C666.53 167.208 712.538 172.943 736.353 163.088C760.167 153.234 764.14 120.924 746.651 93.3868C717.461 47.4252 638.894 77.8642 601.018 116.979C568.164 150.908 557 201.079 576.467 246.924C593.342 286.664 630.24 310.55 671.68 302.614C756.114 286.446 729.747 206.546 681.86 186.442C630.54 164.898 492 209.318 495.026 287.644C496.837 334.494 518.402 366.466 582.455 367.287C680.013 368.538 771.538 299.456 898.634 292.434C1007.02 286.446 1192.67 309.384 1242.36 382.258C1266.99 418.39 1273.65 443.108 1247.75 474.477C1217.32 511.33 1149.4 511.259 1096.84 466.093C1044.29 420.928 1029.14 380.576 1033.97 324.172C1038.31 273.428 1069.55 228.986 1117.2 216.384C1152.2 207.128 1188.29 213.629 1194.45 245.127C1201.49 281.062 1132.22 280.104 1100.44 272.673C1065.32 264.464 1044.22 234.837 1032.77 201.413C1019.29 162.061 1029.71 131.126 1056.44 100.965C1086.19 67.4032 1143.96 54.5526 1175.78 86.1513C1207.02 117.17 1186.81 143.379 1156.22 166.691C1112.57 199.959 1052.57 186.238 999.784 155.164C957.312 130.164 899.171 63.7054 931.284 26.3214C952.068 2.12513 996.288 3.87363 1007.22 43.58C1018.15 83.2749 1003.56 122.644 975.969 163.376C948.377 204.107 907.272 255.122 913.558 321.045C919.727 385.734 990.968 497.068 1063.84 503.35C1111.46 507.456 1166.79 511.984 1175.68 464.527C1191.52 379.956 1101.26 334.985 1030.29 377.017C971.109 412.064 956.297 483.647 953.797 561.655C947.587 755.413 1197.56 941.828 936.039 1140.66C745.771 1285.32 321.926 950.737 134.536 1202.19C-6.68295 1391.68 -53.4837 1655.38 131.935 1760.5C478.381 1956.91 1124.19 1515 1201.28 1997.83C1273.66 2451.23 100.805 1864.7 303.794 2668.89"
        stroke="#C2F84F"
        strokeWidth="20"
        style={{
          pathLength,
          strokeDashoffset: useTransform(pathLength, (value) => 1 - value),
        }}
      />
      
      {steps.map((step, index) => {
        const positions = [
          { x: 600, y: 300 },    // Paso 1
          { x: 500, y: 600 },    // Paso 2  
          { x: 550, y: 900 },    // Paso 3 (más centrado)
          { x: 550, y: 1200 },   // Paso 4 (más centrado)
          { x: 550, y: 1400 }    // Paso 5 (más arriba y centrado)
        ];
        
        const pos = positions[index] || { x: 550, y: 300 + index * 300 };
        
        return (
          <motion.g key={step.number}>
            <motion.foreignObject
              x={pos.x - 180}
              y={pos.y - 25}
              width="360"
              height="120"
              style={{
                opacity: useTransform(scrollYProgress, 
                  [step.progress - 0.05, step.progress + 0.05], 
                  [0, 1]
                ),
                y: useTransform(scrollYProgress, 
                  [step.progress - 0.05, step.progress + 0.05], 
                  [pos.y, pos.y - 25]
                )
              }}
            >
              <motion.div 
                className="bg-gradient-to-r from-[#1F3A4B] to-[#2A4A5A] rounded-2xl p-6 shadow-3xl border-2 border-[#C2F84F]/50 backdrop-blur-sm"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 25px 50px rgba(194, 248, 79, 0.25)",
                  borderColor: "rgba(194, 248, 79, 0.7)"
                }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="text-[#C2F84F] font-bold text-lg mb-3">{step.title}</h4>
                <p className="text-[#FAFDEE] text-base leading-relaxed">{step.description}</p>
              </motion.div>
            </motion.foreignObject>
          </motion.g>
        );
      })}
    </svg>
  );
};

/**
 * Skiper 19 — React + framer motion
 * Inspired by and adapted from https://comgio.ai/
 * We respect the original creators. This is an inspired rebuild with our own taste and does not claim any ownership.
 * These animations aren’t associated with the comgio.ai . They’re independent recreations meant to study interaction design
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Feedback and contributions are welcome.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.in
 * Twitter: https://x.com/Gur__vi
 */

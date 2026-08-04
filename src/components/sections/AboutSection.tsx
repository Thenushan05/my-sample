import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { personal } from "../../data/personal";
import { SectionHeading } from "../ui/SectionHeading";
import Lanyard from "../ui/Lanyard/Lanyard";
import { generateCardFace } from "../ui/Lanyard/generateCardFace";
import profileImage from "../../assets/profile.png";

export const AboutSection: React.FC = () => {
  const [cardFrontImage, setCardFrontImage] = useState<string | null>(null);
  const [isSpiderman, setIsSpiderman] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("spiderman")
  );
  const [isIronman, setIsIronman] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("ironman")
  );

  useEffect(() => {
    let active = true;
    const name = isIronman ? "Tony Stark" : isSpiderman ? "Peter Parker" : "Thenushan Sritharan";
    const title = isIronman ? "Genius, Billionaire, Engineer" : isSpiderman ? "Friendly Neighborhood Hero" : "Software Engineer";
    const img = isIronman ? "/ironman_nomask.png" : isSpiderman ? "/spiderman_nomask.png" : profileImage;

    generateCardFace(name, title, img, isSpiderman, isIronman).then((url) => {
      if (active) setCardFrontImage(url);
    });

    const syncHeroModes = () => {
      setIsSpiderman(document.documentElement.classList.contains("spiderman"));
      setIsIronman(document.documentElement.classList.contains("ironman"));
    };

    const observer = new MutationObserver(syncHeroModes);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      active = false;
      observer.disconnect();
    };
  }, [isSpiderman, isIronman]);

  // Solid white/translucent pixel for web string
  const webString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';

  return (
    <section id="about" className="w-full py-24 px-6 relative overflow-hidden bg-transparent">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="About Me"
          subtitle="My Background"
          align={isIronman ? "center" : "left"}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center [.ironman_&]:lg:grid-cols-1 [.ironman_&]:justify-items-center">
          {/* Left: About Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="about-text space-y-6 text-white/60 text-sm md:text-base leading-relaxed transition-all duration-500 [.spiderman_&]:-skew-x-6 [.ironman_&]:text-center [.ironman_&]:max-w-3xl"
          >
            <p className="about-text italic">
              I am a software engineer focused on transforming complex ideas into useful, scalable, and visually engaging digital products.
            </p>
            <p className="italic">
              My approach blends technical engineering with analytical business planning, ensuring that every codebase I write serves a solid functional and commercial objective. I enjoy resolving requirements ambiguity, implementing robust API architectures, and designing elegant UI layouts.
            </p>

            {/* Animated statistics */}
            <div className="grid grid-cols-2 gap-4 pt-4 [.ironman_&]:grid-cols-4 [.ironman_&]:gap-4">
              {[
                { value: "4+", suffix: "Client Projects", desc: "Successfully delivered client systems" },
                { value: "25+", suffix: "Client Meetings", desc: "Collaborated to frame solid product goals" },
                { value: "5+", suffix: "BRDs Authored", desc: "Written requirements specifications" },
                { value: "Multi", suffix: "AI & Web Apps", desc: "Designed full-stack intelligent systems" },
              ].map((stat, i) => (
                <div key={i} className="stats-card border border-white/5 bg-white/[0.01] p-4 rounded-xl font-mono [.spiderman_&]:rounded-none [.spiderman_&]:border-white/20 [.spiderman_&]:border-y [.spiderman_&]:border-x-0 [.spiderman_&]:bg-black/40 [.spiderman_&]:backdrop-blur-md transition-all duration-500 [.ironman_&]:stark-hud-panel [.ironman_&]:py-6">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent block [.spiderman_&]:!text-white [.ironman_&]:!text-cyan-400 italic">
                    {stat.value}
                  </span>
                  <span className="text-[10px] text-white/80 font-bold block uppercase mt-1 [.spiderman_&]:text-red-500 [.ironman_&]:text-amber-500 italic">
                    {stat.suffix}
                  </span>
                  <span className="text-[9px] text-white/30 block mt-0.5 leading-tight italic">
                    {stat.desc}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Interactive Lanyard ID Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full h-[500px] md:h-[600px] hidden md:block"
          >
            <Lanyard
              position={[0, 0, 20]}
              gravity={[0, -40, 0]}
              fov={20}
              transparent={true}
              frontImage={cardFrontImage}
              imageFit="cover"
              lanyardImage={isSpiderman ? webString : null}
              lanyardWidth={isSpiderman ? 0.3 : 1}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default AboutSection;

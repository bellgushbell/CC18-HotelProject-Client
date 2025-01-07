import React, { useEffect, useState } from "react";

import PromotionModal from "../ModalOther/PromotionModal";
import axios from "axios";
import { motion } from "framer-motion";
const API = import.meta.env.VITE_API;

function PromotionListShowAll() {
  const [selectedPromo, setSelectedPromo] = useState(null); //modal
  const [promotions, setPromotions] = useState([]);

  const getPromotions = async () => {
    const result = await axios.get(
      `${API}/promotion?isActive=true&sortBy=startDate&`
    );
    setPromotions(result.data.promotion);
  };
  useEffect(() => {
    getPromotions();
  }, []);
  console.log(promotions);

  // decoration
  const openModal = (promo) => {
    setSelectedPromo(promo);
  };

  const closeModal = () => {
    setSelectedPromo(null);
  };

  const handleMouseMove = (e, index) => {
    const card = document.getElementById(`promo-card-${index}`);
    const shadow = document.getElementById(`shadow-card-${index}`);
    const rect = card.getBoundingClientRect(); //ได้ตำแหน่งและขนาดของการ์ดใน viewport (เช่น ตำแหน่ง x, y, ความกว้าง และความสูง)
    const x = e.clientX - rect.left; //คำนวณตำแหน่งของเมาส์ภายในการ์ด โดยการลบตำแหน่งเริ่มต้นของการ์ด
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((centerY - y) / centerY) * 10;
    const rotateY = ((centerX - x) / centerX) * -10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    card.style.transition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)";

    shadow.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(-100px)`;
    shadow.style.transition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)";
  };

  const handleMouseLeave = (index) => {
    const card = document.getElementById(`promo-card-${index}`);
    card.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)"; //รีเซ็ตการหมุน (rotateX และ rotateY) และการขยายขนาด (scale) ของการ์ดให้กลับมาเป็นค่าเริ่มต้น
    card.style.transition = "transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)"; //สำหรับการคืนค่าให้กลับมาเป็นค่าเริ่มต้นอย่างนุ่มนวล
  };

  return (
    <div className="mx-auto p-6 relative justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promo, index) => (
          <motion.div
            key={promo.id}
            className="mb-8"
            style={{
              perspective: "1000px",
              width: "400px",
              height: "200px",
              position: "relative",
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
          >
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                transform: "translateZ(-800px)",
                transition: "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
                boxShadow:
                  "0 60px 80px rgba(0, 0, 0, 0.4), 0 20px 40px rgba(0, 0, 0, 0.3)",
                zIndex: -1,
              }}
            ></div>

            <div
              id={`promo-card-${index}`}
              className="relative bg-[#FFF8EC] rounded-lg shadow-md overflow-hidden cursor-pointer flex "
              style={{
                width: "100%",
                height: "100%",
                transformStyle: "preserve-3d",
                transition: "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
              }}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={() => handleMouseLeave(index)}
              onClick={() => openModal(promo)}
            >
              <img
                src={promo.img}
                alt="Promotion"
                className="w-[200px] h-full object-cover rounded-l-lg"
              />
              <div className="flex flex-col justify-center items-center p-4 text-center">
                <h3 className="text-orange-600 text-lg font-bold">
                  Special Discounts{" "}
                  {promo.discountPercent > 0
                    ? `${promo.discountPercent}%`
                    : `${promo.discountValue}฿`}
                </h3>
                <p className="text-gray-600 text-sm">{promo.name}</p>
                <button
                  className="mt-4 bg-orange-500 text-white py-1 px-4 rounded-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(promo);
                  }}
                >
                  More
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedPromo && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={closeModal}
        >
          <PromotionModal promo={selectedPromo} onClose={closeModal} />
        </div>
      )}
    </div>
  );
}

export default PromotionListShowAll;

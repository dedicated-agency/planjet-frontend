import React, { useEffect, useState } from "react";

interface EllipsisTextProps {
  text: string;
  width: string;
}

const EllipsisText: React.FC<EllipsisTextProps> = ({ text, width }) => {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    const adjustText = () => {
      const container = document.createElement("div");
      container.style.position = "absolute"; // Hech qachon ko'rinmaydi
      container.style.visibility = "hidden"; // Hech qachon ko'rinmaydi
      container.style.whiteSpace = "nowrap"; // Bir qatorda ko'rsatish
      document.body.appendChild(container); // Hujjatga qo'shamiz

      let words = text.split(" ");

      // Dastlabki matnni tiklash
      setDisplayText(text);

      // Matnni qismiga kesish
      while (container.scrollWidth > parseFloat(width) && words.length > 0) {
        words.pop(); // Oxirgi so'zni o'chirish
        container.textContent = words.join(" ") + "..."; // Qolgan so'zlarni qo'shish
        if (container.scrollWidth <= parseFloat(width)) {
          setDisplayText(container.textContent); // Qolgan matnni state'ga o'rnatish
        }
      }

      document.body.removeChild(container); // Hujjatdan olib tashlaymiz
    };

    adjustText();
  }, [text, width]); // text yoki width o'zgarganda qayta ishga tushadi

  return (
    <div
      style={{
        width: width,
        overflow: "hidden",
        whiteSpace: "nowrap", // Bir qatorda ko'rsatish
        textOverflow: "ellipsis",
        display: "block",
        fontFamily: "SF Pro Display",
      }}
      className='text-[17px] font-medium leading-6'
    >
      {displayText}
    </div>
  );
};

export default EllipsisText;

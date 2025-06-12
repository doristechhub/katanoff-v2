const PolicyContent = ({ sections = [] }) => {
  return (
    <div className="py-6 md:py-10">
      <div className="flex flex-col gap-8 text-gray-800 text-sm md:text-base leading-relaxed">
        {sections?.map((section, idx) => (
          <div
            key={idx}
            className="text-sm md:text-lg xl:text-lg font-normal text-baseblack"
          >
            {section?.description}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PolicyContent;

const TermsAndPrivacyContent = ({ sections = [] }) => {
  return (
    <div className="py-6 md:py-10">
      <div className="flex flex-col gap-8 text-gray-800 text-sm md:text-base leading-relaxed">
        {sections.map((section, idx) => (
          <div key={idx}>
            <h2 className="text-base xl:text-xl text-baseblack md:text-lg font-bold mb-2">
              {`${idx + 1}. ${section.title}`}
            </h2>
            <p className="text-sm md:text-lg xl:text-xl font-medium text-baseblack">
              {section.description.split('\n').map((line, lineIdx) => (
                <span key={lineIdx}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermsAndPrivacyContent;

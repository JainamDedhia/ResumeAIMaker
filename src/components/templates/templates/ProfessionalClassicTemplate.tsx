import React from 'react';
import { ParsedResumeData } from '../../../utils/resumeParser';

interface ProfessionalClassicTemplateProps {
  data: ParsedResumeData;
}

const ProfessionalClassicTemplate: React.FC<ProfessionalClassicTemplateProps> = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-900 shadow-lg" style={{ fontFamily: 'Times New Roman, serif' }}>
      {/* Header */}
      <div className="border-b-3 border-gray-800 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2 tracking-wide">
          {data.personalInfo.name.toUpperCase()}
        </h1>
        <div className="text-center text-gray-700 space-y-1">
          <div className="flex justify-center items-center space-x-4 text-sm">
            <span>{data.personalInfo.phone}</span>
            <span>•</span>
            <span>{data.personalInfo.email}</span>
            <span>•</span>
            <span>{data.personalInfo.location}</span>
          </div>
          {(data.personalInfo.linkedin || data.personalInfo.github) && (
            <div className="flex justify-center items-center space-x-4 text-sm">
              {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
              {data.personalInfo.linkedin && data.personalInfo.github && <span>•</span>}
              {data.personalInfo.github && <span>{data.personalInfo.github}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1 uppercase tracking-wide">
            Professional Summary
          </h2>
          <p className="text-gray-800 leading-relaxed text-justify">
            {data.summary}
          </p>
        </div>
      )}

      {/* Core Skills */}
      {(data.skills.technical.length > 0 || data.skills.frameworks.length > 0) && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1 uppercase tracking-wide">
            Core Skills & Technologies
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {data.skills.technical.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Technical Skills:</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {data.skills.technical.join(', ')}
                </p>
              </div>
            )}
            {data.skills.frameworks.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Frameworks:</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {data.skills.frameworks.join(', ')}
                </p>
              </div>
            )}
            {data.skills.tools.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Tools:</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {data.skills.tools.join(', ')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Professional Experience */}
      {data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1 uppercase tracking-wide">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{exp.title}</h3>
                    <p className="text-gray-700 font-medium">{exp.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 text-sm font-medium">
                      {exp.startDate} - {exp.endDate}
                    </p>
                    {exp.location && (
                      <p className="text-gray-500 text-sm">{exp.location}</p>
                    )}
                  </div>
                </div>
                <div className="ml-4">
                  {exp.description.map((desc, descIndex) => (
                    <p key={descIndex} className="text-gray-700 text-sm mb-1 leading-relaxed">
                      • {desc}
                    </p>
                  ))}
                  {exp.achievements.map((achievement, achIndex) => (
                    <p key={achIndex} className="text-gray-700 text-sm mb-1 leading-relaxed">
                      • {achievement}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1 uppercase tracking-wide">
            Key Projects
          </h2>
          <div className="space-y-3">
            {data.projects.slice(0, 4).map((project, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900">{project.name}</h3>
                  {project.url && (
                    <a href={project.url} className="text-blue-600 text-sm hover:underline">
                      View Project
                    </a>
                  )}
                </div>
                <p className="text-gray-700 text-sm mb-2 leading-relaxed">{project.description}</p>
                {project.technologies.length > 0 && (
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">Technologies:</span> {project.technologies.join(', ')}
                  </p>
                )}
                {project.highlights.length > 0 && (
                  <div className="ml-4 mt-1">
                    {project.highlights.slice(0, 2).map((highlight, hIndex) => (
                      <p key={hIndex} className="text-gray-700 text-sm leading-relaxed">
                        • {highlight}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1 uppercase tracking-wide">
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-700">{edu.institution}</p>
                  {edu.honors && edu.honors.length > 0 && (
                    <p className="text-gray-600 text-sm italic">{edu.honors.join(', ')}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-gray-600 text-sm font-medium">{edu.graduationDate}</p>
                  {edu.gpa && (
                    <p className="text-gray-500 text-sm">GPA: {edu.gpa}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1 uppercase tracking-wide">
            Certifications
          </h2>
          <div className="space-y-2">
            {data.certifications.map((cert, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900">{cert.name}</h3>
                  {cert.issuer && <p className="text-gray-700 text-sm">{cert.issuer}</p>}
                </div>
                <p className="text-gray-600 text-sm">{cert.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalClassicTemplate;
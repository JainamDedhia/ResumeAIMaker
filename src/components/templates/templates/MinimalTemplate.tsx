import React from 'react';
import { ParsedResumeData } from '../../../utils/resumeParser';

interface MinimalTemplateProps {
  data: ParsedResumeData;
}

const MinimalTemplate: React.FC<MinimalTemplateProps> = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-900 shadow-sm" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      {/* Minimal Header */}
      <div className="mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-light text-gray-900 mb-3">
          {data.personalInfo.name}
        </h1>
        <div className="text-gray-600 space-y-1 text-sm">
          <div className="flex items-center space-x-4">
            <span>{data.personalInfo.email}</span>
            <span>•</span>
            <span>{data.personalInfo.phone}</span>
            <span>•</span>
            <span>{data.personalInfo.location}</span>
          </div>
          {(data.personalInfo.linkedin || data.personalInfo.github) && (
            <div className="flex items-center space-x-4">
              {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
              {data.personalInfo.linkedin && data.personalInfo.github && <span>•</span>}
              {data.personalInfo.github && <span>{data.personalInfo.github}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-8">
          <p className="text-gray-800 leading-relaxed">
            {data.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6 pb-1 border-b border-gray-200">
            Experience
          </h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="font-medium text-gray-900">{exp.title}</h3>
                  <span className="text-gray-500 text-sm">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <p className="text-gray-700 mb-2">{exp.company}</p>
                {exp.location && (
                  <p className="text-gray-500 text-sm mb-3">{exp.location}</p>
                )}
                <div className="space-y-1">
                  {exp.description.map((desc, descIndex) => (
                    <p key={descIndex} className="text-gray-700 text-sm leading-relaxed">
                      • {desc}
                    </p>
                  ))}
                  {exp.achievements.map((achievement, achIndex) => (
                    <p key={achIndex} className="text-gray-700 text-sm leading-relaxed">
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
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-1 border-b border-gray-200">
            Projects
          </h2>
          <div className="space-y-4">
            {data.projects.slice(0, 4).map((project, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-medium text-gray-900">{project.name}</h3>
                  {project.url && (
                    <a href={project.url} className="text-blue-600 text-sm hover:underline">
                      View
                    </a>
                  )}
                </div>
                <p className="text-gray-700 text-sm mb-2 leading-relaxed">
                  {project.description}
                </p>
                {project.technologies.length > 0 && (
                  <p className="text-gray-500 text-sm mb-2">
                    {project.technologies.join(', ')}
                  </p>
                )}
                {project.highlights.length > 0 && (
                  <div className="space-y-1">
                    {project.highlights.slice(0, 2).map((highlight, hIndex) => (
                      <p key={hIndex} className="text-gray-600 text-sm">
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

      {/* Skills */}
      {(data.skills.technical.length > 0 || data.skills.frameworks.length > 0) && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-1 border-b border-gray-200">
            Skills
          </h2>
          <div className="space-y-2">
            {data.skills.technical.length > 0 && (
              <p className="text-gray-700 text-sm">
                <span className="font-medium">Technical:</span> {data.skills.technical.join(', ')}
              </p>
            )}
            {data.skills.frameworks.length > 0 && (
              <p className="text-gray-700 text-sm">
                <span className="font-medium">Frameworks:</span> {data.skills.frameworks.join(', ')}
              </p>
            )}
            {data.skills.tools.length > 0 && (
              <p className="text-gray-700 text-sm">
                <span className="font-medium">Tools:</span> {data.skills.tools.join(', ')}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-1 border-b border-gray-200">
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                  <span className="text-gray-500 text-sm">{edu.graduationDate}</span>
                </div>
                <p className="text-gray-700">{edu.institution}</p>
                {edu.gpa && (
                  <p className="text-gray-500 text-sm">GPA: {edu.gpa}</p>
                )}
                {edu.honors && edu.honors.length > 0 && (
                  <p className="text-gray-600 text-sm">{edu.honors.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-1 border-b border-gray-200">
            Certifications
          </h2>
          <div className="space-y-2">
            {data.certifications.map((cert, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900">{cert.name}</h3>
                  {cert.issuer && <p className="text-gray-700 text-sm">{cert.issuer}</p>}
                </div>
                <p className="text-gray-500 text-sm">{cert.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MinimalTemplate;
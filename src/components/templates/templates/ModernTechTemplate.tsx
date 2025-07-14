import React from 'react';
import { ParsedResumeData } from '../../../utils/resumeParser';
import { Github, ExternalLink, Calendar, MapPin } from 'lucide-react';

interface ModernTechTemplateProps {
  data: ParsedResumeData;
}

const ModernTechTemplate: React.FC<ModernTechTemplateProps> = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-900 shadow-xl" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header with gradient accent */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-8 rounded-t-lg">
        <h1 className="text-4xl font-bold mb-2">{data.personalInfo.name}</h1>
        <p className="text-cyan-100 text-xl mb-4">Full Stack Developer</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center">
            <span className="mr-2">📧</span>
            {data.personalInfo.email}
          </div>
          <div className="flex items-center">
            <span className="mr-2">📱</span>
            {data.personalInfo.phone}
          </div>
          {data.personalInfo.linkedin && (
            <div className="flex items-center">
              <span className="mr-2">💼</span>
              LinkedIn
            </div>
          )}
          {data.personalInfo.github && (
            <div className="flex items-center">
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </div>
          )}
        </div>
      </div>

      <div className="p-8">
        {/* Professional Summary */}
        {data.summary && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-1 h-8 bg-cyan-500 mr-4"></span>
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">{data.summary}</p>
          </div>
        )}

        {/* Skills Matrix */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-1 h-8 bg-cyan-500 mr-4"></span>
            TECHNICAL SKILLS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.skills.technical.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border-l-4 border-blue-500">
                <h3 className="font-bold text-blue-900 mb-3">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.technical.slice(0, 6).map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {data.skills.frameworks.length > 0 && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border-l-4 border-green-500">
                <h3 className="font-bold text-green-900 mb-3">Frameworks</h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.frameworks.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {data.skills.tools.length > 0 && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border-l-4 border-purple-500">
                <h3 className="font-bold text-purple-900 mb-3">Tools & Platforms</h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.tools.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Experience with modern cards */}
        {data.experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-1 h-8 bg-cyan-500 mr-4"></span>
              PROFESSIONAL EXPERIENCE
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg border-l-4 border-cyan-500 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{exp.title}</h3>
                      <p className="text-cyan-600 font-semibold text-lg">{exp.company}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-gray-600 mb-1">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm font-medium">
                          {exp.startDate} - {exp.endDate}
                        </span>
                      </div>
                      {exp.location && (
                        <div className="flex items-center text-gray-500 text-sm">
                          <MapPin className="w-4 h-4 mr-1" />
                          {exp.location}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {exp.description.map((desc, descIndex) => (
                      <p key={descIndex} className="text-gray-700 flex items-start">
                        <span className="text-cyan-500 mr-2 mt-1">▸</span>
                        {desc}
                      </p>
                    ))}
                    {exp.achievements.map((achievement, achIndex) => (
                      <p key={achIndex} className="text-gray-700 flex items-start">
                        <span className="text-green-500 mr-2 mt-1">★</span>
                        {achievement}
                      </p>
                    ))}
                  </div>
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, techIndex) => (
                          <span key={techIndex} className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Featured Projects */}
        {data.projects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-1 h-8 bg-cyan-500 mr-4"></span>
              FEATURED PROJECTS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.projects.slice(0, 4).map((project, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-gray-900 text-lg">{project.name}</h3>
                    <div className="flex space-x-2">
                      {project.github && (
                        <Github className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
                      )}
                      {project.url && (
                        <ExternalLink className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-4 leading-relaxed">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech, techIndex) => (
                          <span key={techIndex} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {project.highlights.length > 0 && (
                    <div className="space-y-1">
                      {project.highlights.slice(0, 2).map((highlight, hIndex) => (
                        <p key={hIndex} className="text-gray-600 text-sm flex items-start">
                          <span className="text-cyan-500 mr-2">•</span>
                          {highlight}
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
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-1 h-8 bg-cyan-500 mr-4"></span>
              EDUCATION
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index} className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{edu.degree}</h3>
                      <p className="text-gray-700 font-medium">{edu.institution}</p>
                      {edu.honors && edu.honors.length > 0 && (
                        <p className="text-blue-600 text-sm font-medium mt-1">{edu.honors.join(', ')}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600 font-medium">{edu.graduationDate}</p>
                      {edu.gpa && (
                        <p className="text-gray-500 text-sm">GPA: {edu.gpa}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-1 h-8 bg-cyan-500 mr-4"></span>
              CERTIFICATIONS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.certifications.map((cert, index) => (
                <div key={index} className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h3 className="font-bold text-green-900">{cert.name}</h3>
                  {cert.issuer && <p className="text-green-700 text-sm">{cert.issuer}</p>}
                  <p className="text-green-600 text-sm font-medium">{cert.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernTechTemplate;
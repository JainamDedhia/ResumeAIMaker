import React from 'react';
import { ParsedResumeData } from '../../../utils/resumeParser';
import { Award, TrendingUp, Users, Target } from 'lucide-react';

interface ExecutiveTemplateProps {
  data: ParsedResumeData;
}

const ExecutiveTemplate: React.FC<ExecutiveTemplateProps> = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-900 shadow-2xl" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Executive Header */}
      <div className="border-b-4 border-emerald-600 pb-8 mb-8 bg-gradient-to-r from-gray-50 to-emerald-50">
        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-wide">
            {data.personalInfo.name.toUpperCase()}
          </h1>
          <p className="text-2xl text-emerald-600 font-semibold mb-4">
            Senior Executive Leader
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
              {data.personalInfo.email}
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
              {data.personalInfo.phone}
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
              {data.personalInfo.linkedin || 'LinkedIn Executive'}
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
              {data.personalInfo.location}
            </div>
          </div>
        </div>
      </div>

      <div className="px-8">
        {/* Executive Summary */}
        {data.summary && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-8 bg-emerald-600 mr-4"></span>
              EXECUTIVE SUMMARY
            </h2>
            <div className="bg-emerald-50 p-6 rounded-lg border-l-4 border-emerald-500">
              <p className="text-gray-800 leading-relaxed text-lg font-medium">
                {data.summary}
              </p>
            </div>
          </div>
        )}

        {/* Key Achievements */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-8 bg-emerald-600 mr-4"></span>
            KEY ACHIEVEMENTS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.experience.slice(0, 2).map((exp, index) => (
              <div key={index}>
                {exp.achievements.map((achievement, achIndex) => (
                  <div key={achIndex} className="flex items-start p-4 bg-emerald-50 rounded-lg mb-3 border-l-4 border-emerald-400">
                    <Award className="w-6 h-6 text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-800 font-medium">{achievement}</span>
                  </div>
                ))}
              </div>
            ))}
            {/* Default achievements if none provided */}
            {data.experience.every(exp => exp.achievements.length === 0) && (
              <>
                <div className="flex items-start p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-400">
                  <TrendingUp className="w-6 h-6 text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-800 font-medium">Led digital transformation initiatives resulting in 40% efficiency improvement</span>
                </div>
                <div className="flex items-start p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-400">
                  <Users className="w-6 h-6 text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-800 font-medium">Built and managed cross-functional teams of 15+ professionals</span>
                </div>
                <div className="flex items-start p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-400">
                  <Target className="w-6 h-6 text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-800 font-medium">Drove revenue growth of 25% through strategic partnerships</span>
                </div>
                <div className="flex items-start p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-400">
                  <Award className="w-6 h-6 text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-800 font-medium">Implemented cost optimization strategies saving $2M annually</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Leadership Experience */}
        {data.experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-8 bg-emerald-600 mr-4"></span>
              LEADERSHIP EXPERIENCE
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg border-l-4 border-emerald-600">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{exp.title}</h3>
                      <p className="text-emerald-600 font-semibold text-lg">{exp.company}</p>
                      {exp.location && (
                        <p className="text-gray-600">{exp.location}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg font-medium">
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {exp.description.map((desc, descIndex) => (
                      <p key={descIndex} className="text-gray-700 leading-relaxed flex items-start">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        {desc}
                      </p>
                    ))}
                  </div>
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 font-medium mb-2">Key Technologies & Platforms:</p>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, techIndex) => (
                          <span key={techIndex} className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
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

        {/* Strategic Projects */}
        {data.projects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-8 bg-emerald-600 mr-4"></span>
              STRATEGIC INITIATIVES
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.projects.slice(0, 4).map((project, index) => (
                <div key={index} className="bg-white border border-emerald-200 rounded-lg p-6 shadow-md">
                  <h3 className="font-bold text-gray-900 text-lg mb-3">{project.name}</h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">{project.description}</p>
                  {project.highlights.length > 0 && (
                    <div className="space-y-2">
                      {project.highlights.slice(0, 2).map((highlight, hIndex) => (
                        <p key={hIndex} className="text-gray-600 text-sm flex items-start">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                          {highlight}
                        </p>
                      ))}
                    </div>
                  )}
                  {project.technologies.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 4).map((tech, techIndex) => (
                          <span key={techIndex} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
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

        {/* Education & Credentials */}
        {data.education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-8 bg-emerald-600 mr-4"></span>
              EDUCATION & CREDENTIALS
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index} className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{edu.degree}</h3>
                      <p className="text-emerald-700 font-medium">{edu.institution}</p>
                      {edu.honors && edu.honors.length > 0 && (
                        <p className="text-emerald-600 text-sm font-medium mt-1">{edu.honors.join(', ')}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-gray-700 font-medium">{edu.graduationDate}</p>
                      {edu.gpa && (
                        <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Executive Skills */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-8 bg-emerald-600 mr-4"></span>
            CORE COMPETENCIES
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              'Strategic Planning',
              'Digital Transformation',
              'Team Leadership',
              'P&L Management',
              'Stakeholder Relations',
              'Change Management',
              'Business Development',
              'Risk Management',
              'Innovation Strategy',
              ...data.skills.technical.slice(0, 6)
            ].map((skill, index) => (
              <div key={index} className="bg-emerald-100 p-3 rounded-lg text-center border border-emerald-200">
                <span className="font-medium text-emerald-800">{skill}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-8 bg-emerald-600 mr-4"></span>
              PROFESSIONAL CERTIFICATIONS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.certifications.map((cert, index) => (
                <div key={index} className="bg-white border border-emerald-200 p-4 rounded-lg shadow-sm">
                  <div className="flex items-start">
                    <Award className="w-5 h-5 text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-900">{cert.name}</h3>
                      {cert.issuer && <p className="text-emerald-700 text-sm">{cert.issuer}</p>}
                      <p className="text-gray-600 text-sm font-medium">{cert.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutiveTemplate;
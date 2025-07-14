import React from 'react';
import { ParsedResumeData } from '../../../utils/resumeParser';
import { Palette, Award, ExternalLink } from 'lucide-react';

interface CreativeDesignTemplateProps {
  data: ParsedResumeData;
}

const CreativeDesignTemplate: React.FC<CreativeDesignTemplateProps> = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 text-gray-900 shadow-2xl rounded-lg overflow-hidden" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Creative Header */}
      <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative z-10 text-center">
          <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full mx-auto mb-4 flex items-center justify-center backdrop-blur-sm">
            <span className="text-3xl font-bold">
              {data.personalInfo.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2 tracking-wide">{data.personalInfo.name}</h1>
          <p className="text-xl text-purple-100 mb-4">Creative Professional</p>
          <div className="flex justify-center space-x-6 text-sm">
            <span className="flex items-center">
              <span className="mr-2">✉️</span>
              {data.personalInfo.email}
            </span>
            <span className="flex items-center">
              <span className="mr-2">📱</span>
              {data.personalInfo.phone}
            </span>
            <span className="flex items-center">
              <span className="mr-2">📍</span>
              {data.personalInfo.location}
            </span>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Creative Vision */}
        {data.summary && (
          <div className="mb-8 p-6 bg-white bg-opacity-70 rounded-2xl shadow-lg backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-purple-600 mb-4 flex items-center">
              <Palette className="w-6 h-6 mr-3" />
              Creative Vision
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg italic">
              "{data.summary}"
            </p>
          </div>
        )}

        {/* Skills in creative layout */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">Creative Expertise</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...data.skills.technical, ...data.skills.frameworks, ...data.skills.tools].slice(0, 12).map((skill, index) => {
              const colors = [
                'from-purple-400 to-pink-400',
                'from-pink-400 to-orange-400',
                'from-orange-400 to-yellow-400',
                'from-yellow-400 to-green-400',
                'from-green-400 to-blue-400',
                'from-blue-400 to-purple-400'
              ];
              return (
                <div key={index} className={`p-4 bg-gradient-to-r ${colors[index % colors.length]} rounded-xl text-center shadow-lg transform hover:scale-105 transition-transform`}>
                  <span className="font-semibold text-white text-sm">{skill}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Experience with creative cards */}
        {data.experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">Professional Journey</h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index} className="relative">
                  <div className="bg-white bg-opacity-80 p-6 rounded-2xl shadow-lg backdrop-blur-sm border-l-4 border-gradient-to-b from-purple-500 to-pink-500">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{exp.title}</h3>
                        <p className="text-purple-600 font-semibold text-lg">{exp.company}</p>
                      </div>
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                        {exp.startDate} - {exp.endDate}
                      </div>
                    </div>
                    <div className="space-y-2">
                      {exp.description.map((desc, descIndex) => (
                        <p key={descIndex} className="text-gray-700 flex items-start">
                          <span className="text-purple-500 mr-2 mt-1">✦</span>
                          {desc}
                        </p>
                      ))}
                      {exp.achievements.map((achievement, achIndex) => (
                        <p key={achIndex} className="text-gray-700 flex items-start">
                          <Award className="w-4 h-4 text-orange-500 mr-2 mt-1 flex-shrink-0" />
                          {achievement}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio Projects */}
        {data.projects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">Featured Portfolio</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.projects.slice(0, 4).map((project, index) => {
                const gradients = [
                  'from-purple-500 to-pink-500',
                  'from-pink-500 to-orange-500',
                  'from-orange-500 to-yellow-500',
                  'from-green-500 to-blue-500'
                ];
                return (
                  <div key={index} className="bg-white bg-opacity-80 rounded-2xl p-6 shadow-lg backdrop-blur-sm hover:shadow-xl transition-shadow">
                    <div className={`w-full h-32 bg-gradient-to-r ${gradients[index % gradients.length]} rounded-lg mb-4 flex items-center justify-center relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                      <div className="relative z-10 text-center text-white">
                        <Palette className="w-8 h-8 mx-auto mb-2" />
                        <span className="text-sm font-semibold">Project Showcase</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                      {project.url && (
                        <ExternalLink className="w-5 h-5 text-purple-500 hover:text-purple-700 cursor-pointer" />
                      )}
                    </div>
                    <p className="text-gray-700 text-sm mb-4 leading-relaxed">{project.description}</p>
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.technologies.map((tech, techIndex) => (
                          <span key={techIndex} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {project.highlights.length > 0 && (
                      <div className="space-y-1">
                        {project.highlights.slice(0, 2).map((highlight, hIndex) => (
                          <p key={hIndex} className="text-gray-600 text-sm flex items-start">
                            <span className="text-pink-500 mr-2">★</span>
                            {highlight}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Education with creative styling */}
        {data.education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">Educational Background</h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index} className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-2xl shadow-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{edu.degree}</h3>
                      <p className="text-purple-700 font-medium">{edu.institution}</p>
                      {edu.honors && edu.honors.length > 0 && (
                        <p className="text-pink-600 text-sm font-medium mt-1">{edu.honors.join(', ')}</p>
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

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">Certifications & Awards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.certifications.map((cert, index) => (
                <div key={index} className="bg-gradient-to-r from-orange-100 to-yellow-100 border border-orange-200 p-4 rounded-xl shadow-md">
                  <div className="flex items-start">
                    <Award className="w-6 h-6 text-orange-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-orange-900">{cert.name}</h3>
                      {cert.issuer && <p className="text-orange-700 text-sm">{cert.issuer}</p>}
                      <p className="text-orange-600 text-sm font-medium">{cert.date}</p>
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

export default CreativeDesignTemplate;
import React from 'react';
import { ParsedResumeData } from '../../../utils/resumeParser';
import { GraduationCap, BookOpen, Award, Users } from 'lucide-react';

interface AcademicTemplateProps {
  data: ParsedResumeData;
}

const AcademicTemplate: React.FC<AcademicTemplateProps> = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-900 shadow-lg" style={{ fontFamily: 'Times New Roman, serif' }}>
      {/* Academic Header */}
      <div className="text-center border-b-2 border-orange-500 pb-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {data.personalInfo.name}
        </h1>
        <p className="text-lg text-orange-600 mb-3">
          Academic Researcher & Educator
        </p>
        <div className="text-gray-600 space-y-1 text-sm">
          <p>{data.personalInfo.email} | {data.personalInfo.phone}</p>
          <p>{data.personalInfo.location}</p>
          {data.personalInfo.linkedin && (
            <p>{data.personalInfo.linkedin}</p>
          )}
        </div>
      </div>

      {/* Research Interests */}
      {data.summary && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-orange-200 pb-2 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-orange-600" />
            RESEARCH INTERESTS
          </h2>
          <p className="text-gray-700 leading-relaxed text-justify">
            {data.summary}
          </p>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-orange-200 pb-2 flex items-center">
            <GraduationCap className="w-5 h-5 mr-2 text-orange-600" />
            EDUCATION
          </h2>
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index} className="pl-4 border-l-2 border-orange-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{edu.degree}</h3>
                    <p className="text-orange-700 font-medium">{edu.institution}</p>
                    {edu.honors && edu.honors.length > 0 && (
                      <p className="text-orange-600 text-sm italic mt-1">{edu.honors.join(', ')}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 font-medium">{edu.graduationDate}</p>
                    {edu.gpa && (
                      <p className="text-gray-500 text-sm">GPA: {edu.gpa}</p>
                    )}
                  </div>
                </div>
                {edu.relevantCourses && edu.relevantCourses.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Relevant Coursework:</span> {edu.relevantCourses.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Publications & Research */}
      {(data.publications && data.publications.length > 0) || data.projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-orange-200 pb-2 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-orange-600" />
            PUBLICATIONS & RESEARCH
          </h2>
          
          {data.publications && data.publications.length > 0 ? (
            <div className="space-y-4">
              {data.publications.map((pub, index) => (
                <div key={index} className="pl-4 border-l-2 border-orange-100">
                  <h3 className="font-medium text-gray-900 mb-1">"{pub.title}"</h3>
                  <p className="text-gray-700 text-sm mb-1">
                    {pub.authors.join(', ')}
                  </p>
                  <p className="text-orange-600 text-sm italic">
                    {pub.journal}, {pub.date}
                  </p>
                  {pub.doi && (
                    <p className="text-gray-500 text-xs mt-1">DOI: {pub.doi}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {data.projects.slice(0, 3).map((project, index) => (
                <div key={index} className="pl-4 border-l-2 border-orange-100">
                  <h3 className="font-bold text-gray-900">{project.name}</h3>
                  <p className="text-gray-700 text-sm mb-2 leading-relaxed">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <p className="text-orange-600 text-sm">
                      <span className="font-medium">Technologies:</span> {project.technologies.join(', ')}
                    </p>
                  )}
                  {project.highlights.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {project.highlights.map((highlight, hIndex) => (
                        <p key={hIndex} className="text-gray-600 text-sm">
                          • {highlight}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Academic Experience */}
      {data.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-orange-200 pb-2 flex items-center">
            <Users className="w-5 h-5 mr-2 text-orange-600" />
            ACADEMIC EXPERIENCE
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div key={index} className="pl-4 border-l-2 border-orange-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{exp.title}</h3>
                    <p className="text-orange-600 font-medium">{exp.company}</p>
                    {exp.location && (
                      <p className="text-gray-500 text-sm">{exp.location}</p>
                    )}
                  </div>
                  <span className="text-gray-600 text-sm font-medium">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
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

      {/* Technical Skills */}
      {(data.skills.technical.length > 0 || data.skills.frameworks.length > 0) && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-orange-200 pb-2">
            TECHNICAL SKILLS
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...data.skills.technical, ...data.skills.frameworks, ...data.skills.tools].map((skill, index) => (
              <div key={index} className="text-gray-700 text-sm">
                • {skill}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Awards & Honors */}
      {(data.awards && data.awards.length > 0) || data.certifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-orange-200 pb-2 flex items-center">
            <Award className="w-5 h-5 mr-2 text-orange-600" />
            AWARDS & HONORS
          </h2>
          
          {data.awards && data.awards.length > 0 ? (
            <div className="space-y-3">
              {data.awards.map((award, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{award.title}</h3>
                    <p className="text-orange-600 text-sm">{award.issuer}</p>
                    {award.description && (
                      <p className="text-gray-600 text-sm mt-1">{award.description}</p>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm">{award.date}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {data.certifications.map((cert, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{cert.name}</h3>
                    {cert.issuer && <p className="text-orange-600 text-sm">{cert.issuer}</p>}
                  </div>
                  <p className="text-gray-500 text-sm">{cert.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Languages */}
      {data.languages && data.languages.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-orange-200 pb-2">
            LANGUAGES
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {data.languages.map((lang, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-700">{lang.language}</span>
                <span className="text-orange-600 text-sm font-medium">{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professional Memberships */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-orange-200 pb-2">
          PROFESSIONAL MEMBERSHIPS
        </h2>
        <div className="space-y-2">
          <p className="text-gray-700 text-sm">• IEEE Computer Society</p>
          <p className="text-gray-700 text-sm">• ACM (Association for Computing Machinery)</p>
          <p className="text-gray-700 text-sm">• Academic Research Consortium</p>
        </div>
      </div>
    </div>
  );
};

export default AcademicTemplate;
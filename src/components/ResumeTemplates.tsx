import React from 'react';
import { ResumeTemplate } from './TemplateSelector';

interface ResumeTemplatesProps {
  template: ResumeTemplate;
  data: any;
  className?: string;
}

const ResumeTemplates: React.FC<ResumeTemplatesProps> = ({ template, data, className = '' }) => {
  const renderProfessionalClassic = () => (
    <div className={`bg-white text-gray-900 p-8 max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <div className="border-b-2 border-gray-300 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {data.name || 'JAINAM DEDHIA'}
        </h1>
        <div className="text-gray-600 space-y-1">
          <p>{data.phone || '+91 7021419016'} | {data.email || 'jainamdedhia5@gmail.com'}</p>
          <p>{data.location || 'Thane, Maharashtra'}</p>
          <p>{data.linkedin || 'linkedin.com/in/jainam-dedhia'} | {data.github || 'github.com/jainamdedhia'}</p>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
          PROFESSIONAL SUMMARY
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {data.summary || 'Experienced software developer with expertise in modern web technologies and strong problem-solving skills. Proven track record of delivering high-quality solutions and driving business growth through innovative technical implementations.'}
        </p>
      </div>

      {/* Core Skills */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
          CORE SKILLS & TECHNOLOGIES
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {(data.skills || ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'Git', 'AWS', 'MongoDB', 'Express.js']).map((skill: string, index: number) => (
            <div key={index} className="text-gray-700">• {skill}</div>
          ))}
        </div>
      </div>

      {/* Professional Experience */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
          PROFESSIONAL EXPERIENCE
        </h2>
        {(data.experience || [
          {
            title: 'Software Developer',
            company: 'Tech Company',
            duration: '2022 - Present',
            description: 'Developed and maintained web applications using modern technologies. Collaborated with cross-functional teams to deliver high-quality software solutions.'
          }
        ]).map((exp: any, index: number) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                <p className="text-gray-600">{exp.company}</p>
              </div>
              <span className="text-gray-600 text-sm">{exp.duration}</span>
            </div>
            <p className="text-gray-700 ml-4">• {exp.description}</p>
            <p className="text-gray-700 ml-4">• Delivered measurable results and exceeded performance expectations</p>
            <p className="text-gray-700 ml-4">• Collaborated with team members to achieve project goals</p>
          </div>
        ))}
      </div>

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
            PROJECTS
          </h2>
          {data.projects.slice(0, 3).map((project: any, index: number) => (
            <div key={index} className="mb-3">
              <h3 className="font-semibold text-gray-900">{project.name}</h3>
              <p className="text-gray-700">• {project.description || 'Innovative project showcasing technical skills and problem-solving abilities'}</p>
              <p className="text-gray-600 text-sm">Technology: {project.language || 'Various technologies'} | GitHub Stars: {project.stars || 0}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
          EDUCATION
        </h2>
        {(data.education || [
          {
            degree: 'Bachelor of Engineering in Computer Science',
            school: 'K.J. Somaiya College of Engineering',
            year: '2024'
          }
        ]).map((edu: any, index: number) => (
          <div key={index} className="mb-2">
            <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
            <p className="text-gray-600">{edu.school} | {edu.year}</p>
          </div>
        ))}
      </div>

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
            CERTIFICATIONS
          </h2>
          {data.certifications.map((cert: string, index: number) => (
            <div key={index} className="mb-1">
              <p className="text-gray-700">• {cert}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTechModern = () => (
    <div className={`bg-white text-gray-900 p-8 max-w-4xl mx-auto ${className}`}>
      {/* Header with accent */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-6 rounded-lg mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {data.name || 'JAINAM DEDHIA'}
        </h1>
        <p className="text-cyan-100 text-lg mb-3">
          {data.headline || 'Full Stack Developer'}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>📧 {data.email || 'jainamdedhia5@gmail.com'}</div>
          <div>📱 {data.phone || '+91 7021419016'}</div>
          <div>🔗 {data.linkedin || 'LinkedIn Profile'}</div>
          <div>💻 {data.github || 'GitHub Profile'}</div>
        </div>
      </div>

      {/* Skills Matrix */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="w-1 h-6 bg-cyan-500 mr-3"></span>
          TECHNICAL SKILLS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Frontend</h3>
            <div className="flex flex-wrap gap-2">
              {['React', 'TypeScript', 'JavaScript', 'HTML/CSS'].map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Backend</h3>
            <div className="flex flex-wrap gap-2">
              {['Node.js', 'Python', 'Java', 'MongoDB'].map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Experience with modern layout */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="w-1 h-6 bg-cyan-500 mr-3"></span>
          EXPERIENCE
        </h2>
        {(data.experience || [
          {
            title: 'Software Developer',
            company: 'Tech Company',
            duration: '2022 - Present',
            description: 'Developed full-stack web applications using modern technologies'
          }
        ]).map((exp: any, index: number) => (
          <div key={index} className="mb-6 p-4 border-l-4 border-cyan-500 bg-gray-50">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                <p className="text-cyan-600 font-medium">{exp.company}</p>
              </div>
              <span className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm">
                {exp.duration}
              </span>
            </div>
            <p className="text-gray-700">{exp.description}</p>
          </div>
        ))}
      </div>

      {/* Featured Projects */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="w-1 h-6 bg-cyan-500 mr-3"></span>
            FEATURED PROJECTS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.projects.slice(0, 4).map((project: any, index: number) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-2">{project.name}</h3>
                <p className="text-gray-700 text-sm mb-2">{project.description || 'Technical project showcasing development skills'}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {project.language || 'JavaScript'}
                  </span>
                  <span className="text-xs text-yellow-600">⭐ {project.stars || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="w-1 h-6 bg-cyan-500 mr-3"></span>
          EDUCATION
        </h2>
        {(data.education || [
          {
            degree: 'Bachelor of Engineering in Computer Science',
            school: 'K.J. Somaiya College of Engineering',
            year: '2024'
          }
        ]).map((edu: any, index: number) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
            <p className="text-gray-600">{edu.school} • {edu.year}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCreativePortfolio = () => (
    <div className={`bg-gradient-to-br from-purple-50 to-pink-50 text-gray-900 p-8 max-w-4xl mx-auto ${className}`}>
      {/* Creative Header */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-white text-2xl font-bold">
            {(data.name || 'JD').split(' ').map((n: string) => n[0]).join('')}
          </span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          {data.name || 'JAINAM DEDHIA'}
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          {data.headline || 'Creative Developer'}
        </p>
        <div className="flex justify-center space-x-6 text-sm text-gray-600">
          <span>{data.email || 'jainamdedhia5@gmail.com'}</span>
          <span>{data.phone || '+91 7021419016'}</span>
          <span>{data.portfolio || 'portfolio.com'}</span>
        </div>
      </div>

      {/* Creative Summary */}
      <div className="mb-8 p-6 bg-white/70 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-purple-600 mb-4">Creative Vision</h2>
        <p className="text-gray-700 leading-relaxed">
          {data.summary || 'Passionate creative professional with a unique blend of artistic vision and technical expertise. Dedicated to creating compelling digital experiences that engage and inspire audiences.'}
        </p>
      </div>

      {/* Skills in creative layout */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-purple-600 mb-6">Expertise</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {(data.skills || ['UI/UX Design', 'Web Development', 'Creative Coding', 'Digital Art', 'Branding', 'Animation']).map((skill: string, index: number) => (
            <div key={index} className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg text-center">
              <span className="font-medium text-purple-800">{skill}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Projects */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-purple-600 mb-6">Featured Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.projects.slice(0, 4).map((project: any, index: number) => (
              <div key={index} className="bg-white/70 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-full h-32 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">Project Preview</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{project.name}</h3>
                <p className="text-gray-700 text-sm">{project.description || 'Creative project showcasing design and development skills'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-purple-600 mb-6">Education</h2>
        {(data.education || [
          {
            degree: 'Bachelor of Engineering in Computer Science',
            school: 'K.J. Somaiya College of Engineering',
            year: '2024'
          }
        ]).map((edu: any, index: number) => (
          <div key={index} className="p-4 bg-white/70 rounded-lg">
            <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
            <p className="text-gray-600">{edu.school} • {edu.year}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderExecutivePremium = () => (
    <div className={`bg-white text-gray-900 p-8 max-w-4xl mx-auto ${className}`}>
      {/* Executive Header */}
      <div className="border-b-4 border-emerald-600 pb-6 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          {data.name || 'JAINAM DEDHIA'}
        </h1>
        <p className="text-xl text-emerald-600 font-semibold mb-3">
          {data.headline || 'Technology Leader'}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
          <div>📧 {data.email || 'jainamdedhia5@gmail.com'}</div>
          <div>📱 {data.phone || '+91 7021419016'}</div>
          <div>🔗 {data.linkedin || 'LinkedIn Executive'}</div>
          <div>📍 {data.location || 'Thane, Maharashtra'}</div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="w-2 h-8 bg-emerald-600 mr-4"></span>
          EXECUTIVE SUMMARY
        </h2>
        <p className="text-gray-700 leading-relaxed text-lg">
          {data.summary || 'Visionary technology leader with proven experience in driving digital transformation and leading high-performing engineering teams. Demonstrated track record of delivering innovative solutions and driving business growth through strategic technology initiatives.'}
        </p>
      </div>

      {/* Key Achievements */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="w-2 h-8 bg-emerald-600 mr-4"></span>
          KEY ACHIEVEMENTS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(data.achievements || [
            'Led development of scalable applications serving 10,000+ users',
            'Implemented modern development practices reducing deployment time by 60%',
            'Built and managed cross-functional teams of 15+ professionals',
            'Drove digital transformation initiatives resulting in 40% efficiency improvement'
          ]).map((achievement: string, index: number) => (
            <div key={index} className="flex items-start p-4 bg-emerald-50 rounded-lg">
              <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span className="text-gray-700">{achievement}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Leadership Experience */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="w-2 h-8 bg-emerald-600 mr-4"></span>
          LEADERSHIP EXPERIENCE
        </h2>
        {(data.experience || [
          {
            title: 'Senior Software Engineer',
            company: 'Technology Company',
            duration: '2022 - Present',
            description: 'Led development of enterprise-scale applications and mentored junior developers in modern development practices.'
          }
        ]).map((exp: any, index: number) => (
          <div key={index} className="mb-6 p-6 border-l-4 border-emerald-600 bg-gray-50">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{exp.title}</h3>
                <p className="text-emerald-600 font-semibold text-lg">{exp.company}</p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg font-medium">
                {exp.duration}
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed">{exp.description}</p>
          </div>
        ))}
      </div>

      {/* Education & Certifications */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="w-2 h-8 bg-emerald-600 mr-4"></span>
          EDUCATION & CERTIFICATIONS
        </h2>
        {(data.education || [
          {
            degree: 'Bachelor of Engineering in Computer Science',
            school: 'K.J. Somaiya College of Engineering',
            year: '2024'
          }
        ]).map((edu: any, index: number) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg mb-4">
            <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
            <p className="text-gray-600">{edu.school} • {edu.year}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAcademicResearch = () => (
    <div className={`bg-white text-gray-900 p-8 max-w-4xl mx-auto ${className}`}>
      {/* Academic Header */}
      <div className="text-center border-b-2 border-orange-500 pb-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {data.name || 'JAINAM DEDHIA'}
        </h1>
        <p className="text-lg text-orange-600 mb-3">
          {data.headline || 'Computer Science Researcher'}
        </p>
        <div className="text-gray-600 space-y-1">
          <p>{data.email || 'jainamdedhia5@gmail.com'} | {data.phone || '+91 7021419016'}</p>
          <p>{data.institution || 'K.J. Somaiya College of Engineering'} | {data.department || 'Computer Science Department'}</p>
        </div>
      </div>

      {/* Research Interests */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-orange-200 pb-2">
          RESEARCH INTERESTS
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {data.researchInterests || 'Advanced research in software engineering, web technologies, and machine learning applications. Focus on developing innovative solutions for modern computing challenges and exploring emerging technologies in computer science.'}
        </p>
      </div>

      {/* Education */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-orange-200 pb-2">
          EDUCATION
        </h2>
        {(data.education || [
          {
            degree: 'Bachelor of Engineering in Computer Science',
            school: 'K.J. Somaiya College of Engineering',
            year: '2024',
            thesis: 'Advanced Web Application Development'
          }
        ]).map((edu: any, index: number) => (
          <div key={index} className="mb-4">
            <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
            <p className="text-gray-600">{edu.school}, {edu.year}</p>
            {edu.thesis && (
              <p className="text-gray-700 italic">Thesis: {edu.thesis}</p>
            )}
          </div>
        ))}
      </div>

      {/* Publications */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-orange-200 pb-2">
          PROJECTS & PUBLICATIONS
        </h2>
        {(data.publications || data.projects || [
          'Advanced To-Do List Android Application - Mobile application development using Java',
          'Attendance Website - Web application using PHP and MySQL for educational institutions'
        ]).map((pub: string, index: number) => (
          <div key={index} className="mb-3 pl-4 border-l-2 border-orange-200">
            <p className="text-gray-700">{pub}</p>
          </div>
        ))}
      </div>

      {/* Academic Experience */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-orange-200 pb-2">
          ACADEMIC EXPERIENCE
        </h2>
        {(data.experience || [
          {
            title: 'Research Assistant',
            institution: 'K.J. Somaiya College of Engineering',
            duration: '2023 - 2024',
            description: 'Conducted research in web technologies and software development methodologies'
          }
        ]).map((exp: any, index: number) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                <p className="text-orange-600">{exp.institution || exp.company}</p>
              </div>
              <span className="text-gray-600">{exp.duration}</span>
            </div>
            <p className="text-gray-700">{exp.description}</p>
          </div>
        ))}
      </div>

      {/* Technical Skills */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-orange-200 pb-2">
          TECHNICAL SKILLS
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {(data.skills || ['Java', 'JavaScript', 'PHP', 'Python', 'React', 'Node.js', 'MySQL', 'MongoDB', 'Git', 'Android Development']).map((skill: string, index: number) => (
            <div key={index} className="text-gray-700">• {skill}</div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMinimalClean = () => (
    <div className={`bg-white text-gray-900 p-8 max-w-4xl mx-auto ${className}`}>
      {/* Minimal Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-light text-gray-900 mb-4">
          {data.name || 'Jainam Dedhia'}
        </h1>
        <div className="text-gray-600 space-y-1 text-sm">
          <p>{data.email || 'jainamdedhia5@gmail.com'} • {data.phone || '+91 7021419016'}</p>
          <p>{data.location || 'Thane, Maharashtra'}</p>
          <p>{data.linkedin || 'linkedin.com/in/jainam-dedhia'} • {data.github || 'github.com/jainamdedhia'}</p>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-8">
        <p className="text-gray-700 leading-relaxed">
          {data.summary || 'Software developer with expertise in modern web technologies and strong problem-solving skills. Focused on delivering high-quality solutions and continuous learning in the field of computer science.'}
        </p>
      </div>

      {/* Experience */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Experience</h2>
        {(data.experience || [
          {
            title: 'Software Developer',
            company: 'Technology Company',
            duration: '2022 - Present',
            description: 'Developed web applications using modern frameworks and collaborated with cross-functional teams'
          }
        ]).map((exp: any, index: number) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-baseline mb-2">
              <h3 className="font-medium text-gray-900">{exp.title}</h3>
              <span className="text-gray-500 text-sm">{exp.duration}</span>
            </div>
            <p className="text-gray-600 mb-2">{exp.company}</p>
            <p className="text-gray-700 text-sm">{exp.description}</p>
          </div>
        ))}
      </div>

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Projects</h2>
          {data.projects.slice(0, 3).map((project: any, index: number) => (
            <div key={index} className="mb-4">
              <h3 className="font-medium text-gray-900">{project.name}</h3>
              <p className="text-gray-700 text-sm">{project.description || 'Technical project showcasing development skills'}</p>
              <p className="text-gray-500 text-xs mt-1">{project.language || 'JavaScript'}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Skills</h2>
        <p className="text-gray-700">
          {(data.skills || ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'Git', 'MongoDB']).join(' • ')}
        </p>
      </div>

      {/* Education */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Education</h2>
        {(data.education || [
          {
            degree: 'Bachelor of Engineering in Computer Science',
            school: 'K.J. Somaiya College of Engineering',
            year: '2024'
          }
        ]).map((edu: any, index: number) => (
          <div key={index} className="mb-2">
            <div className="flex justify-between items-baseline">
              <span className="font-medium text-gray-900">{edu.degree}</span>
              <span className="text-gray-500 text-sm">{edu.year}</span>
            </div>
            <p className="text-gray-600">{edu.school}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const templateRenderers = {
    'professional-classic': renderProfessionalClassic,
    'tech-modern': renderTechModern,
    'creative-portfolio': renderCreativePortfolio,
    'executive-premium': renderExecutivePremium,
    'academic-research': renderAcademicResearch,
    'minimal-clean': renderMinimalClean
  };

  const renderer = templateRenderers[template.id as keyof typeof templateRenderers];
  return renderer ? renderer() : renderProfessionalClassic();
};

export default ResumeTemplates;
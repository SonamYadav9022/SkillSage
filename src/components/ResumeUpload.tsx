'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Upload, FileText, X, CheckCircle } from 'lucide-react'

interface ResumeUploadProps {
  onUpload: (data: any) => void
}

export default function ResumeUpload({ onUpload }: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedSkills, setExtractedSkills] = useState<string[]>([])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    const file = files.find(f => f.type === 'application/pdf' || f.type === 'application/msword' || f.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    
    if (file) {
      handleFileUpload(file)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file)
    setIsProcessing(true)
    
    // Simulate resume processing
    setTimeout(() => {
      const mockSkills = [
        'JavaScript', 'React', 'Node.js', 'HTML', 'CSS', 
        'Python', 'Git', 'MongoDB', 'Express.js', 'TypeScript',
        'Problem Solving', 'Team Collaboration', 'Project Management'
      ]
      setExtractedSkills(mockSkills)
      setIsProcessing(false)
    }, 2000)
  }

  const handleConfirmUpload = () => {
    onUpload({
      resume: uploadedFile,
      currentSkills: extractedSkills,
      experience: 'College Student',
      education: 'Computer Science'
    })
  }

  const removeFile = () => {
    setUploadedFile(null)
    setExtractedSkills([])
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Your Resume
          </CardTitle>
          <CardDescription>
            Upload your resume in PDF, DOC, or DOCX format to analyze your current skills
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!uploadedFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">Drop your resume here</p>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <label className="cursor-pointer">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button variant="outline">Browse Files</Button>
              </label>
              <p className="text-xs text-gray-400 mt-4">
                Supported formats: PDF, DOC, DOCX (Max 10MB)
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-medium">{uploadedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={removeFile}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {isProcessing ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Analyzing your resume...</p>
                </div>
              ) : extractedSkills.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Skills Extracted Successfully!</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {extractedSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <Button onClick={handleConfirmUpload} className="w-full">
                    Continue to Goal Setting
                  </Button>
                </div>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual Entry */}
      <Card>
        <CardHeader>
          <CardTitle>Or Enter Skills Manually</CardTitle>
          <CardDescription>
            Don't have a resume ready? Enter your current skills manually
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Your Skills</label>
            <textarea
              className="w-full p-3 border rounded-lg resize-none h-32"
              placeholder="Enter your skills separated by commas...&#10;Example: JavaScript, React, Python, Git, Communication"
              onChange={(e) => {
                const skills = e.target.value.split(',').map(s => s.trim()).filter(s => s)
                setExtractedSkills(skills)
              }}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Experience Level</label>
            <select className="w-full p-3 border rounded-lg">
              <option>College Student</option>
              <option>Recent Graduate</option>
              <option>Entry Level (0-2 years)</option>
              <option>Mid Level (2-5 years)</option>
              <option>Senior Level (5+ years)</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Field of Study</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg"
              placeholder="e.g., Computer Science, Business, Engineering"
            />
          </div>

          <Button 
            onClick={() => onUpload({
              resume: null,
              currentSkills: extractedSkills,
              experience: 'College Student',
              education: 'Computer Science'
            })}
            className="w-full"
            disabled={extractedSkills.length === 0}
          >
            Continue to Goal Setting
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
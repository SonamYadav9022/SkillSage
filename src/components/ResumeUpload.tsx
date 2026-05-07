"use client";

import {
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Upload,
  FileText,
  X,
  CheckCircle,
  Eye,
} from "lucide-react";

interface ResumeUploadProps {
  onUpload: (data: any) => void;
  savedData?: any;
  onReset?: () => void;
}

export default function ResumeUpload({
  onUpload,
  savedData,
  onReset,
}: ResumeUploadProps) {
  const [isDragging, setIsDragging] =
    useState(false);

  const [uploadedFile, setUploadedFile] =
    useState<any>(null);

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [msg, setMsg] = useState("");

  const [skills, setSkills] =
    useState("");

  const [goal, setGoal] =
    useState("");

  const [experience, setExperience] =
    useState("College Student");

  const abortRef =
    useRef<AbortController | null>(null);

  /* ---------- AUTO LOAD SAVED USER DATA ---------- */

  useEffect(() => {
    if (!savedData) return;

    if (savedData.resume) {
      setUploadedFile(savedData.resume);
    } else if (savedData.resumeUrl) {
      setUploadedFile({
        name: "Uploaded Resume",
        url: savedData.resumeUrl,
        size: 0,
      });
    }

    setSkills(
      savedData.manualSkills ||
        savedData.skills?.join(", ") ||
        ""
    );

    setGoal(savedData.goal || "");

    setExperience(
      savedData.experience ||
        "College Student"
    );
  }, [savedData]);

  const handleDragOver =
    useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
      },
      []
    );

  const handleDragLeave =
    useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
      },
      []
    );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file =
        e.dataTransfer.files?.[0];

      if (file) {
        handleFileUpload(file);
      }
    },
    []
  );

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (
    file: File
  ) => {
    setMsg("");

    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowed.includes(file.type)) {
      setMsg(
        "Only PDF, DOC, DOCX files allowed."
      );
      return;
    }

    if (file.size > 1024 * 1024) {
      setMsg("Max file size is 1MB.");
      return;
    }

    setUploadedFile(file);
    setIsProcessing(true);

    const formData = new FormData();
    formData.append("resume", file);

    const controller =
      new AbortController();

    abortRef.current =
      controller;

    try {
      const res = await fetch(
        "/api/resume/upload",
        {
          method: "POST",
          body: formData,
          signal: controller.signal,
        }
      );

      const data =
        await res.json();

      setIsProcessing(false);

      if (res.ok) {
        setMsg(
          "Resume uploaded successfully!"
        );

        const fileData = {
          name: file.name,
          size: file.size,
          url: data.url,
        };

        setUploadedFile(fileData);

        onUpload({
          resume: fileData,
          resumeUrl: data.url,
          manualSkills: skills,
          goal,
          experience,
        });
      } else {
        setMsg(
          data.error ||
            "Upload failed."
        );
      }
    } catch {
      setIsProcessing(false);
      setMsg("Upload failed.");
    }
  };

  const removeFile = async () => {
    if (abortRef.current) {
      abortRef.current.abort();
    }

    await fetch(
      "/api/resume/delete",
      {
        method: "POST",
      }
    );

    setUploadedFile(null);
    setMsg(
      "File deleted successfully."
    );

    if (onReset) onReset();
  };

  const viewFile = () => {
    const fileUrl =
      uploadedFile?.url ||
      savedData?.resumeUrl;

    if (fileUrl) {
      window.open(
        fileUrl,
        "_blank"
      );
    }
  };

  const continueManual = () => {
    onUpload({
      manualSkills: skills,
      goal,
      experience,
      resume: uploadedFile,
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* LEFT */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex gap-2 items-center text-[22px]">
            <Upload className="w-5 h-5" />
            Upload Your Resume
          </CardTitle>

          <CardDescription className="text-md">
            Upload your resume in PDF,
            DOC, DOCX format
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!uploadedFile ? (
            <div
              className={`border-2 border-dashed rounded-2xl p-10 text-center transition ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              }`}
              onDragOver={
                handleDragOver
              }
              onDragLeave={
                handleDragLeave
              }
              onDrop={handleDrop}
            >
              <FileText className="w-14 h-14 mx-auto mb-4 text-gray-400" />

              <p className="text-[22px] font-medium mb-2">
                Drop your resume here
              </p>

              <p className="text-gray-500 mb-5">
                or
              </p>

              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={
                    handleFileSelect
                  }
                  className="hidden"
                />

                <span className="inline-block px-6 py-3 border rounded-xl hover:bg-gray-100 transition">
                  Browse Files
                </span>
              </label>

              <p className="text-sm text-gray-400 mt-5">
                Max Size: 1MB
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gray-50 flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <FileText className="w-8 h-8 text-blue-600" />

                  <div>
                    <p className="font-semibold">
                      {uploadedFile.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {uploadedFile.size
                        ? `${(
                            uploadedFile.size /
                            1024 /
                            1024
                          ).toFixed(
                            1
                          )} MB`
                        : "Saved File"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={
                      viewFile
                    }
                    className="p-2 hover:bg-gray-200 rounded-lg"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={
                      removeFile
                    }
                    className="p-2 hover:bg-gray-200 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isProcessing ? (
                <p>Uploading...</p>
              ) : (
                <div className="flex gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  Resume Uploaded
                </div>
              )}
            </div>
          )}

          {msg && (
            <p className="mt-4 text-sm text-blue-600">
              {msg}
            </p>
          )}
        </CardContent>
      </Card>

      {/* RIGHT */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-[22px]">
            Or Enter Skills
            Manually
          </CardTitle>

          <CardDescription className="text-md">
            Your signup data auto
            appears here
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div>
            <label className="font-medium">
              Your Skills
            </label>

            <textarea
              rows={4}
              value={skills}
              onChange={(e) =>
                setSkills(
                  e.target.value
                )
              }
              className="w-full mt-2 p-4 rounded-xl border resize-none"
            />
          </div>

          <div>
            <label className="font-medium">
              Career Goals
            </label>

            <Input
              value={goal}
              onChange={(e) =>
                setGoal(
                  e.target.value
                )
              }
              placeholder="AI Engineer"
            />
          </div>

          <div>
            <label className="font-medium">
              Experience Level
            </label>

            <select
              value={experience}
              onChange={(e) =>
                setExperience(
                  e.target.value
                )
              }
              className="w-full mt-2 p-4 rounded-xl border"
            >
              <option>
                College Student
              </option>
              <option>
                Recent Graduate
              </option>
              <option>
                Fresher
              </option>
              <option>
                Working Professional
              </option>
            </select>
          </div>

          <Button
            onClick={
              continueManual
            }
            className="w-full h-12"
          >
            Continue to Goal
            Setting
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
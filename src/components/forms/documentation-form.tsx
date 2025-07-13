'use client'

import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { DocumentationFormData } from '@/lib/validation'
import { Upload, X, FileText, Image } from 'lucide-react'

interface DocumentationFormProps {
  form: UseFormReturn<DocumentationFormData>
}

export function DocumentationForm({ form }: DocumentationFormProps) {
  const { register, formState: { errors }, watch, setValue } = form
  const [dragActive, setDragActive] = useState(false)

  const handleFileUpload = (
    files: FileList | null, 
    fieldName: keyof DocumentationFormData,
    multiple = false
  ) => {
    if (!files) return

    if (multiple) {
      const currentFiles = watch(fieldName as any) as File[] || []
      const newFiles = Array.from(files)
      setValue(fieldName as any, [...currentFiles, ...newFiles])
    } else {
      setValue(fieldName as any, files[0])
    }
  }

  const removeFile = (fieldName: keyof DocumentationFormData, index?: number) => {
    if (index !== undefined) {
      const currentFiles = watch(fieldName as any) as File[]
      const newFiles = currentFiles.filter((_, i) => i !== index)
      setValue(fieldName as any, newFiles)
    } else {
      setValue(fieldName as any, null)
    }
  }

  const FileUploadArea = ({ 
    fieldName, 
    label, 
    accept, 
    multiple = false,
    required = false 
  }: {
    fieldName: keyof DocumentationFormData
    label: string
    accept: string
    multiple?: boolean
    required?: boolean
  }) => {
    const files = watch(fieldName as any)
    const hasError = errors[fieldName]

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && '*'}
        </label>
        
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            hasError ? 'border-red-300 bg-red-50' : 
            dragActive ? 'border-orange-400 bg-orange-50' : 'border-gray-300 hover:border-orange-400'
          }`}
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            setDragActive(false)
            handleFileUpload(e.dataTransfer.files, fieldName, multiple)
          }}
        >
          <input
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={(e) => handleFileUpload(e.target.files, fieldName, multiple)}
            className="hidden"
            id={fieldName}
          />
          
          <label htmlFor={fieldName} className="cursor-pointer">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              <span className="font-medium text-orange-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {accept.includes('image') ? 'PNG, JPG, GIF up to 10MB' : 'PDF, DOC, DOCX up to 10MB'}
            </p>
          </label>
        </div>

        {/* Display uploaded files */}
        {files && (
          <div className="space-y-2">
            {multiple ? (
              Array.isArray(files) && files.map((file: File, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                  <div className="flex items-center gap-2">
                    <Image className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700 truncate">{file.name}</span>
                    <span className="text-xs text-gray-500">
                      ({(file.size / 1024 / 1024).toFixed(1)} MB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(fieldName, index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700 truncate">{(files as File).name}</span>
                  <span className="text-xs text-gray-500">
                    ({((files as File).size / 1024 / 1024).toFixed(1)} MB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(fieldName)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {hasError && (
          <p className="text-sm text-red-600">{hasError.message}</p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Documentation & Agreement
        </h2>
        <p className="text-gray-600">
          Upload required documents and review our partnership terms.
        </p>
      </div>

      {/* Required Documents */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Required Documents</h3>
        
        <FileUploadArea
          fieldName="businessLicenseFile"
          label="Business License"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          required
        />

        <FileUploadArea
          fieldName="foodHandlerPermit"
          label="Food Handler's Permit"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          required
        />

        <FileUploadArea
          fieldName="restaurantPhotos"
          label="Restaurant Photos (Optional)"
          accept=".jpg,.jpeg,.png,.gif"
          multiple
        />
      </div>

      {/* Legal Agreements */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Legal Agreements</h3>
        
        <div className="space-y-4">
          {/* Terms & Conditions */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                {...register('termsAccepted')}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900">
                  Hoppn Vendor Terms & Conditions *
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  I agree to the{' '}
                  <a href="/terms" target="_blank" className="text-orange-600 hover:underline">
                    Vendor Terms & Conditions
                  </a>{' '}
                  including service fees, quality standards, and platform policies.
                </p>
              </div>
            </div>
            {errors.termsAccepted && (
              <p className="mt-2 text-sm text-red-600">{errors.termsAccepted.message}</p>
            )}
          </div>

          {/* Payment Processing */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                {...register('paymentProcessingAccepted')}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900">
                  Payment Processing Agreement *
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  I agree to use Stripe Connect for payment processing with standard processing fees 
                  (2.9% + 30¢ per transaction) and Hoppn's commission structure.
                </p>
              </div>
            </div>
            {errors.paymentProcessingAccepted && (
              <p className="mt-2 text-sm text-red-600">{errors.paymentProcessingAccepted.message}</p>
            )}
          </div>

          {/* Marketing Consent */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                {...register('marketingConsent')}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900">
                  Marketing Communications (Optional)
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  I consent to receive marketing emails about new features, promotions, 
                  and business growth tips from Hoppn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Review Process</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Your application will be reviewed within 24-48 hours</li>
          <li>• We may contact you for additional information or clarification</li>
          <li>• You'll receive an email notification once your application is approved</li>
          <li>• Approved vendors get immediate access to the dashboard and menu setup</li>
        </ul>
      </div>
    </div>
  )
}
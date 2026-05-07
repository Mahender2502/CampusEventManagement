import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    link: {
      type: String,
      default: '',
      trim: true,
      maxlength: 300,
    },
    type: {
      type: String,
      default: 'general',
      trim: true,
      maxlength: 50,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true },
)

notificationSchema.index({ user: 1, createdAt: -1 })

export default mongoose.model('Notification', notificationSchema)

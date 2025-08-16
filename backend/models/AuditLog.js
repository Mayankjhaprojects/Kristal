const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ['created', 'updated', 'deleted', 'logged in'],
    required: true
  },
  fundName: {
    type: String,
    ref: 'ExcelData',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userFullName: {
    type: String,
    required: true
  },
  changes: {
    type: Object,
    required: function () {
      return this.action === 'updated';
    }
    /*
    Format:
    {
      fundName: { from: "Old Fund", to: "New Fund" },
      riskLevel: { from: "Low", to: "Medium" }
    }
    */
  },
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', AuditLogSchema);

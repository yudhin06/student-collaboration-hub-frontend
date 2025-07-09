const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['study-group', 'project-team', 'discussion-forum'],
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    trim: true
  },
  project: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Active', 'Planning', 'Completed'],
    default: 'Active'
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member'
    }
  }],
  topics: {
    type: Number,
    default: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  maxMembers: {
    type: Number,
    default: 50
  }
}, {
  timestamps: true
});

// Index for better query performance
groupSchema.index({ type: 1, name: 1 });
groupSchema.index({ 'members.user': 1 });

// Virtual for member count
groupSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Method to add member
groupSchema.methods.addMember = function(userId) {
  if (this.members.length >= this.maxMembers) {
    throw new Error('Group is full');
  }
  
  const existingMember = this.members.find(member => 
    member.user.toString() === userId.toString()
  );
  
  if (existingMember) {
    throw new Error('User is already a member');
  }
  
  this.members.push({
    user: userId,
    role: this.members.length === 0 ? 'admin' : 'member'
  });
  
  return this.save();
};

// Method to remove member
groupSchema.methods.removeMember = function(userId) {
  const memberIndex = this.members.findIndex(member => 
    member.user.toString() === userId.toString()
  );
  
  if (memberIndex === -1) {
    throw new Error('User is not a member of this group');
  }
  
  // Don't allow admin to leave if they're the only admin
  if (this.members[memberIndex].role === 'admin') {
    const adminCount = this.members.filter(member => member.role === 'admin').length;
    if (adminCount === 1) {
      throw new Error('Cannot remove the only admin from the group');
    }
  }
  
  this.members.splice(memberIndex, 1);
  return this.save();
};

// Method to check if user is member
groupSchema.methods.isMember = function(userId) {
  return this.members.some(member => 
    member.user.toString() === userId.toString()
  );
};

// Method to check if user is admin
groupSchema.methods.isAdmin = function(userId) {
  return this.members.some(member => 
    member.user.toString() === userId.toString() && member.role === 'admin'
  );
};

module.exports = mongoose.model('Group', groupSchema); 
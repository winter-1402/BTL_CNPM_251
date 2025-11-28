// ============================================
// models/Availability.js - Complete Availability Model
// ============================================

class Availability {
  constructor(availabilityId, tutorId) {
    this.availabilityId = availabilityId;
    this.tutorId = tutorId;
    this.availableSlots = []; // [{day, startTime, endTime, isBooked}]
  }

  async addSlot(slot) {
    try {
      // Validate slot
      if (!slot.day || !slot.startTime || !slot.endTime) {
        throw new Error("Invalid slot data");
      }

      // Check for conflicts
      const hasConflict = this.availableSlots.some(
        (existing) =>
          existing.day === slot.day &&
          this.timesOverlap(
            existing.startTime,
            existing.endTime,
            slot.startTime,
            slot.endTime
          )
      );

      if (hasConflict) {
        throw new Error("Time slot conflicts with existing slot");
      }

      slot.isBooked = false;
      this.availableSlots.push(slot);

      await db.storeData("availability_slots", {
        availability_id: this.availabilityId,
        day: slot.day,
        start_time: slot.startTime,
        end_time: slot.endTime,
        is_booked: false,
      });

      return true;
    } catch (error) {
      console.error("Add slot error:", error);
      throw error;
    }
  }

  async removeSlot(slotIndex) {
    try {
      if (slotIndex >= 0 && slotIndex < this.availableSlots.length) {
        const slot = this.availableSlots[slotIndex];

        await db.query(
          "DELETE FROM availability_slots WHERE availability_id = $1 AND day = $2 AND start_time = $3",
          [this.availabilityId, slot.day, slot.startTime]
        );

        this.availableSlots.splice(slotIndex, 1);
        return true;
      }

      throw new Error("Invalid slot index");
    } catch (error) {
      console.error("Remove slot error:", error);
      throw error;
    }
  }

  timesOverlap(start1, end1, start2, end2) {
    return start1 < end2 && start2 < end1;
  }

  async getAvailableSlots(date) {
    try {
      const slots = await db.query(
        "SELECT * FROM availability_slots WHERE availability_id = $1 AND is_booked = false",
        [this.availabilityId]
      );

      return slots;
    } catch (error) {
      console.error("Get available slots error:", error);
      throw error;
    }
  }

  async bookSlot(slotIndex) {
    try {
      if (slotIndex >= 0 && slotIndex < this.availableSlots.length) {
        this.availableSlots[slotIndex].isBooked = true;

        const slot = this.availableSlots[slotIndex];
        await db.query(
          "UPDATE availability_slots SET is_booked = true WHERE availability_id = $1 AND day = $2 AND start_time = $3",
          [this.availabilityId, slot.day, slot.startTime]
        );

        return true;
      }

      throw new Error("Invalid slot index");
    } catch (error) {
      console.error("Book slot error:", error);
      throw error;
    }
  }

  async save() {
    try {
      const data = {
        tutor_id: this.tutorId,
        available_slots: JSON.stringify(this.availableSlots),
      };

      if (this.availabilityId) {
        return await db.updateData("availability", this.availabilityId, data);
      } else {
        return await db.storeData("availability", data);
      }
    } catch (error) {
      console.error("Save availability error:", error);
      throw error;
    }
  }
}

module.exports = { Availability };

// ============================================
// models/LibraryResource.js - Complete Library Resource Model
// ============================================

class LibraryResource {
  constructor(resourceId, title, category, url) {
    this.resourceId = resourceId;
    this.title = title;
    this.category = category;
    this.url = url;
    this.description = null;
    this.uploadedBy = null;
    this.uploadedAt = new Date();
  }

  async addResource() {
    try {
      const data = {
        title: this.title,
        category: this.category,
        url: this.url,
        description: this.description,
        uploaded_by: this.uploadedBy,
        uploaded_at: this.uploadedAt,
      };

      const result = await db.storeData("library_resources", data);
      this.resourceId = result.id;

      console.log(`Resource ${this.resourceId} added successfully`);
      return true;
    } catch (error) {
      console.error("Add resource error:", error);
      throw error;
    }
  }

  async updateResource(updates) {
    try {
      Object.assign(this, updates);

      await db.updateData("library_resources", this.resourceId, updates);

      console.log(`Resource ${this.resourceId} updated successfully`);
      return true;
    } catch (error) {
      console.error("Update resource error:", error);
      throw error;
    }
  }

  async deleteResource() {
    try {
      await db.deleteData("library_resources", this.resourceId);

      console.log(`Resource ${this.resourceId} deleted successfully`);
      return true;
    } catch (error) {
      console.error("Delete resource error:", error);
      throw error;
    }
  }

  static async search(query, category = null) {
    try {
      let sql = "SELECT * FROM library_resources WHERE title ILIKE $1";
      const params = [`%${query}%`];

      if (category) {
        sql += " AND category = $2";
        params.push(category);
      }

      const results = await db.query(sql, params);
      return results;
    } catch (error) {
      console.error("Search resources error:", error);
      throw error;
    }
  }

  static async getByCategory(category) {
    try {
      const resources = await db.queryData("library_resources", { category });
      return resources;
    } catch (error) {
      console.error("Get by category error:", error);
      throw error;
    }
  }

  async syncWithHCMUTLibrary() {
    try {
      // Simulate API call to HCMUT_LIBRARY
      console.log("Syncing with HCMUT_LIBRARY...");

      // In real implementation, this would call the external API
      // const response = await axios.get('https://hcmut-library-api/resources');

      return { success: true, message: "Library synced successfully" };
    } catch (error) {
      console.error("Sync with HCMUT_LIBRARY error:", error);
      throw error;
    }
  }
}

module.exports = { LibraryResource };

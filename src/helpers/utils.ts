/**
 * Chuyển đổi tiêu đề tiếng Việt có dấu thành chuỗi Slug không dấu phục vụ URL
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize('NFD') // Tách các dấu tiếng Việt ra khỏi chữ gốc
    .replace(/[\u0300-\u036f]/g, '') // Xóa các ký tự dấu
    .replace(/[đĐ]/g, 'd') // Thay chữ đ thành d
    .replace(/[^a-z0-9\s-]/g, '') // Loại bỏ tất cả ký tự đặc biệt bằng Regex
    .trim()
    .replace(/\s+/g, '-') // Thay thế khoảng trắng thành dấu gạch ngang
}

export const generateSlugPageAdmin = (title: string): string => {
  return title
    .toLowerCase()
    .substring(0, 150)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}



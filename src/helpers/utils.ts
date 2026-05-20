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

export function extractStoragePaths(content: string, coverImage: string | null): string[] {
  const paths: string[] = [] 
  const BUCKET_NAME = 'blog_images' 

  const cleanPath = (url: string): string | null => {
    if (!url || !url.includes(BUCKET_NAME)) return null 
    const parts = url.split(`${BUCKET_NAME}/`) 
    if (parts.length > 1) {
      // Decode để xử lý các ký tự đặc biệt hoặc khoảng trắng nếu có trong tên file
      return decodeURIComponent(parts[1])  
    }
    return null 
  } 

  // 1. Gom ảnh bìa
  if (coverImage) {
    const coverPath = cleanPath(coverImage) 
    if (coverPath) paths.push(coverPath) 
  }

  // 2. Gom tất cả ảnh nội dung (Quét sạch các thẻ <img src="...">)
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/g 
  let match 
  while ((match = imgRegex.exec(content)) !== null) {
    const imgUrl = match[1] 
    const imgPath = cleanPath(imgUrl) 
    if (imgPath) paths.push(imgPath) 
  }

  return paths 
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import Imagekit from 'imagekit'

export const imageKit = new Imagekit({
  publicKey: 'public_HWTFjcY9U+MQETONQK19IGSBtt4=',
  privateKey: 'private_80LY2uCHWIdBg3hDz3i7Jul85tU=',
  urlEndpoint: 'https://ik.imagekit.io/qaqsezzqo',
})

// un testedexpo
export const UploadFile = async (file: File | any, folder: string = ''): Promise<{ fileId: string, url: string }> => {
  const byte = await file.arrayBuffer()
  const buffer = Buffer.from(byte)

  return new Promise((resolve, reject) => {
    imageKit.upload(
      {
        file: buffer,
        fileName: 'img.jpg',
        folder: 'gco_admin_v2/' + folder,
      },
      (err:any, result:any) => {
        if (err) {
          reject(err)
        } else {
          const { fileId, url } = result as any
          resolve({ fileId, url })
        }
      }
    )
  })
}

export const FileDelete = async (fileId: string) => {
  return new Promise((resolve, reject) => {
    imageKit.deleteFile(fileId, (err:any, result:any) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

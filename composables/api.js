import qs from 'qs'

// 发送评论消息
export const sendMomment22 = (data, id) => {
    const config = useRuntimeConfig()

    return new Promise(async (resolve, reject) => {
        const {data: comment, error, status } =  await useFetch(`${config.public.apiBase}/comments/api::article.article:${id}`, {
            body: data,
            method: 'POST'
        })

        if(error.value) {
            console.log(error.value.data.error)
            reject(error.value.data.error)
        }

        resolve(comment.value)
    })
}

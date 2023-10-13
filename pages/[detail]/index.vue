<script setup>
import { format } from 'date-fns'
import { useMutation } from '@vue/apollo-composable'
import articles from '~/queries/article.gql'
import updateArticle from '~/queries/updateArticle.gql'
import qs from 'qs'
import * as cryptojs from 'crypto-js'

import Prism from 'prismjs';

import 'prismjs/components/index'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-less'
import 'prismjs/components/prism-shell-session'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-ruby'

import 'prismjs/plugins/toolbar/prism-toolbar'
import 'prismjs/plugins/autolinker/prism-autolinker'
import 'prismjs/plugins/autoloader/prism-autoloader'
import 'prismjs/plugins/data-uri-highlight/prism-data-uri-highlight'
import 'prismjs/plugins/download-button/prism-download-button'
import 'prismjs/plugins/inline-color/prism-inline-color'
import 'prismjs/plugins/treeview/prism-treeview'
import 'prismjs/plugins/line-numbers/prism-line-numbers'
import 'prismjs/plugins/unescaped-markup/prism-unescaped-markup'
import 'prismjs/plugins/show-invisibles/prism-show-invisibles'
import 'prismjs/plugins/show-language/prism-show-language'
import 'prismjs/plugins/remove-initial-line-feed/prism-remove-initial-line-feed'
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard'
import { useStore } from '~/composables/sotres';

// useHead({
//     viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
//     charset: 'utf-8',
//     link: [{
//         rel: 'stylesheet',
//         href: '/css/prism.css'
//     }],
//     script: [{
//         src: '/js/prism.js',
//         body: true
//     }
//     ]
// })

const { MD5 } = cryptojs

console.log('detail')

const items = [
    {
        title: 'Home',
        disabled: false,
        href: '/',
    },
    {
        title: 'Blog post',
        disabled: true,
        href: '/',
    },
]

const useKeyStore = useStore().useKeysStore()
const { username: usernam2, email: email2, checkbox: checkbox2 } = useKeyStore

const username = ref(usernam2)
const email = ref(email2)
const checkbox = ref(checkbox2)


// console.log(username.value, email.value)

const route = useRoute()
onMounted(() => {
    setTimeout(async () => {
        await getDetail().then(() => {
            Prism.highlightAll();
            read.value = detail.value.attributes.read + 1
        })
    }, 20)


})

const apiBase = useRuntimeConfig().public.apiBase
// console.log(route)

const detail = ref(null)
const comments = ref(null)

// 获取评论
const getComments = async (id) => {
    const query = qs.stringify({
        sort: 'createdAt:desc'
    })
    await useFetch(`${apiBase}/comments/api::article.article:${id}?${query}`).then(res => {
        // console.log(res)

        if (res.status.value == 'success') {
            comments.value = res.data.value
            comments.value = comments.value.map(comm => ({
                ...comm,
                open: false
            }))

            // 更新阅读数
        }
        // console.log(read.value, commentCount.value)
    })

}

const read = ref(0)
const commentCount = ref(0)

// 更新查看和评论数
const upadteCount = (read1, commentCount1) => {
    const variables = {
        "updateArticleId": Number(detail.value.id),
        "data": {
            "read": read1,
            "commentCount": commentCount1
        }
    }

    // console.log(variables)

    const { mutate: updateArticle1, onDone } = useMutation(updateArticle, () => ({ variables: variables }))

    updateArticle1()

    onDone(({ data }) => {
        // console.log(data.updateArticle.data);
        read.value = data.updateArticle.data.attributes.read
        commentCount.value = data.updateArticle.data.attributes.commentCount
    });
}

const defaultUrl = encodeURIComponent('https://strapi.anran.life/uploads/user_1_cb8eacfd2b.jpg')
// console.log(defaultUrl)

// 获取详情
const getDetail = async () => {
    const variables = {
        // "pagination": {
        //     "page": page.value,
        //     "pageSize": pageSize.value
        // }
        "filters": {
            "slug": {
                "eq": route.params.detail
            }
        }
    }
    const { data, error, status } = await useAsyncQuery(articles, variables)

    // console.log(data, status, error)

    if (status.value == 'success') {
        detail.value = data.value.articles.data[0]
        read.value = data.value.articles.data[0].attributes.read + 1
        commentCount.value = data.value.articles.data[0].attributes.commentCount
        await getComments(detail.value.id).then(res => {
            upadteCount(read.value, commentCount.value)
        })
    }

    if (error.value) {
        console.error(error)
        throw error
    }
}

const baseUrl = useRuntimeConfig().public.baseUrl

const overlay = ref(false)
const overlay2 = ref(false)

const comment = ref({
    "author": {
        "id": "1",
        "name": "",
        "email": "",
        "avatar": "https://strapi.anran.life/uploads/user_1_cb8eacfd2b.jpg"
    },
    "content": "",
    // "threadOf": 2 // id of comment we would like to start / continue the thread (Optional)
})
const comment2 = ref({
    "author": {
        "id": "1",
        "name": "",
        "email": "",
        "avatar": "https://strapi.anran.life/uploads/user_1_cb8eacfd2b.jpg"
    },
    "content": "",
    "threadOf": 0 // id of comment we would like to start / continue the thread (Optional)
})

const avatar = ref('https://strapi.anran.life/uploads/user_1_cb8eacfd2b.jpg')

// 评论
const sendMomment = async (id) => {

    if(comment.value.content.trim() == '') {
        message({
            message:'请先输入评论',
            timeout1: 2000
        })
        return false
    }

    const data = JSON.parse(JSON.stringify(comment.value))
    // console.log(data, id)

    data.author.name = username.value
    data.author.email = email.value 

    // 头像
    const md5Hash = MD5(email.value.toLowerCase()).toString()
    // console.log(`https://www.gravatar.com/avatar/${md5Hash}`)

    // console.log('默认头像', `https://cravatar.cn/avatar/${md5Hash}?d=${defaultUrl}`)
    data.author.avatar = `https://cravatar.cn/avatar/${md5Hash}?d=${defaultUrl}`

    await sendMomment22(data, id).then(res => {
        // console.log(res)
        if (res.id) {
            message({
                message: '评论成功',
                timeout1: 2000
            })
            getComments(detail.value.id)
            overlay.value = false
            comment.value.content = ''
            upadteCount(read.value, commentCount.value + 1)

            // 保存
            if (checkbox.value && username.value.trim() !== '' && email.value.trim() !== '') {
                useKeyStore.$patch({
                    username: username.value,
                    email: email.value,
                    checkbox: true
                })
            } else {
                useKeyStore.$patch({
                    username: '',
                    email: '',
                    checkbox: false
                })

                username.value = ''
                email.value = ''
            }
        }
    }).catch(err => {
        console.log(err)
        message({
            message: JSON.parse(err.message).message,
            timeout1: 2000
        })
    })


}
// 评论2
const sendMomment2 = async () => {
    if(comment2.value.content.trim() == '') {
        message({
            message:'请先输入评论',
            timeout1: 2000
        })
        return false
    }
    const data = JSON.parse(JSON.stringify(comment2.value))
    // console.log(comment2.value)

    data.author.name = username.value
    data.author.email = email.value

     // 头像
     const md5Hash = MD5(email.value.toLowerCase()).toString()
    // console.log(`https://www.gravatar.com/avatar/${md5Hash}`)

    // console.log('默认头像', `https://cravatar.cn/avatar/${md5Hash}?d=${defaultUrl}`)
    data.author.avatar = `https://cravatar.cn/avatar/${md5Hash}?d=${defaultUrl}`

    await sendMomment22(data, detail.value.id).then(res => {
        // console.log(res)
        if (res.id) {
            message({
                message: '评论成功',
                timeout1: 2000
            })
            getComments(detail.value.id)
            overlay2.value = false
            comment2.value.content = ''
            upadteCount(read.value, commentCount.value + 1)

            // 保存
            if (checkbox.value && username.value.trim() !== '' && email.value.trim() !== '') {
                useKeyStore.$patch({
                    username: username.value,
                    email: email.value,
                    checkbox: true
                })
            } else {
                useKeyStore.$patch({
                    username: '',
                    email: '',
                    checkbox: false
                })

                username.value = ''
                email.value = ''
            }
        }
    }).catch(err => {
        console.log(err, JSON.parse(err.message).message)
        message({
            message: JSON.parse(err.message).message,
            timeout1: 2000
        })
    })
}

const snackbar = ref(false)
const text = ref('')
const timeout = ref(2000)

const message = ({ message, timeout1 }) => {
    snackbar.value = true,
        text.value = message,
        timeout.value = timeout1
}
</script>

<template>
    <v-snackbar v-model="snackbar" :timeout="timeout">
        {{ text }}
        <template v-slot:actions>
            <v-btn color="blue" variant="text" @click="snackbar = false">
                Close
            </v-btn>
        </template>
    </v-snackbar>
    <div class="lg:p-8 p-4 max-w-[1200px] mx-auto">
        <!-- part 1 -->
        <div class="w-full mb-8 rounded-md">
            <div class="lg:px-8 px-4 py-4 lg:py-0 bg-[#ecf2ff] flex justify-between items-center">
                <div>
                    <h3 class="text-xl font-bold mb-2">Blog Detail</h3>
                    <v-breadcrumbs class="pl-0 py-0" :items="items" divider="."></v-breadcrumbs>
                </div>
                <div class="py-0 overflow-hidden lg:block hidden">
                    <div class="-mb-16 mt-3">
                        <img src="/imgs/ChatBc.png" alt="breadcrumb">
                    </div>
                </div>
            </div>
        </div>
        <!-- part 2 main -->
        <v-card class="elevation-10" v-if="detail">
            <v-img class="h-[440px] items-end text-right" cover
                :src="baseUrl + detail.attributes.cover.data.attributes.url">
                <v-card-item style="padding: 30px 30px 24px;">
                    <v-chip>{{ detail.attributes.read }}</v-chip>
                </v-card-item>
            </v-img>
            <v-avatar size="40" class="-mt-7 mx-6"
                :image="baseUrl + detail.attributes.author.data.attributes.avatar.data.attributes.url"></v-avatar>
            <v-card-item class="px-6 pt-4" style="padding: 30px 30px 24px;">
                <v-chip size="small">{{ detail.attributes.category.data.attributes.name }}</v-chip>
                <h5 class=" text-4xl my-6">
                    <nuxt-link>{{ detail.attributes.title }}</nuxt-link>
                </h5>
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="flex items-center">
                            <v-avatar class="" style="width: 18px; height: 18px;">
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-eye"
                                    width="24px" height="24px" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                                    fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <circle cx="12" cy="12" r="2"></circle>
                                    <path
                                        d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7">
                                    </path>
                                </svg>
                            </v-avatar>
                            <span class="ml-2 text-sm">{{ detail.attributes.read }}</span>
                        </div>
                        <div class="flex items-center">
                            <v-avatar class=" ml-6" style="width: 18px; height: 18px;">
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-message-2"
                                    width="24px" height="24px" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                                    fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path
                                        d="M12 20l-3 -3h-2a3 3 0 0 1 -3 -3v-6a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-2l-3 3">
                                    </path>
                                    <line x1="8" y1="9" x2="16" y2="9"></line>
                                    <line x1="8" y1="13" x2="14" y2="13"></line>
                                </svg>
                            </v-avatar>
                            <span class="ml-2 text-sm">{{ commentCount }}</span>
                        </div>
                    </div>
                    <div class="flex items-center">
                        <v-avatar class="" style="width: 10px; height: 10px;">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle" width="24px"
                                height="24px" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <circle cx="12" cy="12" r="9"></circle>
                            </svg>
                        </v-avatar>
                        <span class="ml-2 text-sm">{{ format(new Date(detail.attributes.createdAt), 'MM/d') }}</span>
                    </div>
                </div>
            </v-card-item>
            <hr>
            <!-- 文章内容 -->
            <div class="p-6 leading-[1.8] vhtml" v-html="detail.attributes.blocks[0].body"></div>
        </v-card>
        <!-- 评论 -->
        <v-card class="pa-6 mt-6 elevation-10">
            <!-- 评论文章弹窗 -->
            <v-overlay v-model="overlay" class="align-center justify-center">
                <v-card class="pa-6 lg:w-[600px] w-[90vw]">
                    <div class="mb-4 gap-3">
                        <div class="mb-2">显示名称</div>
                        <v-text-field v-model="username" density="compact" color="info" single-line hide-details
                            variant="outlined"></v-text-field>
                    </div>
                    <div class="mb-4 gap-3">
                        <div class="mb-2">电子邮箱地址</div>
                        <v-text-field density="compact" type="email" v-model="email" color="info" single-line hide-details
                            variant="outlined"></v-text-field>
                    </div>
                    <div>
                        <v-checkbox v-model="checkbox">
                            <template v-slot:label>
                                <div class="text-sm">
                                    在此浏览器中保存我的显示名称、邮箱地址，以便下次评论时使用
                                </div>
                            </template>
                        </v-checkbox>
                    </div>
                    <div class="w-full flex justify-end">
                        <v-btn variant="tonal" color="info" size="large" class="lowercase"
                            @click="sendMomment(detail.id)">评论</v-btn>
                    </div>
                </v-card>
            </v-overlay>
            <!-- 评论评论弹窗 -->
            <v-overlay v-model="overlay2" class="align-center justify-center">
                <v-card class="pa-6 lg:w-[600px] w-[90vw]">
                    <div class="mb-4 gap-3">
                        <div class="mb-2">显示名称</div>
                        <v-text-field v-model="username" density="compact" color="info" single-line hide-details
                            variant="outlined"></v-text-field>
                    </div>
                    <div class="mb-4 gap-3">
                        <div class="mb-2">电子邮箱地址</div>
                        <v-text-field density="compact" type="email" v-model="email" color="info" single-line hide-details
                            variant="outlined"></v-text-field>
                    </div>
                    <div>
                        <v-checkbox v-model="checkbox">
                            <template v-slot:label>
                                <div class="text-sm">
                                    在此浏览器中保存我的显示名称、邮箱地址，以便下次评论时使用
                                </div>
                            </template>
                        </v-checkbox>
                    </div>
                    <div class="w-full flex justify-end">
                        <v-btn variant="tonal" color="info" size="large" class="lowercase" @click="sendMomment2">评论</v-btn>
                    </div>
                </v-card>
            </v-overlay>
            <div>
                <div class="flex mb-4 items-center gap-3">
                    <v-avatar size="40" :image="avatar"></v-avatar>
                    <v-text-field density="compact" v-model="comment.content" label="comment" color="info" single-line
                        hide-details variant="outlined"></v-text-field>
                    <v-btn variant="tonal" color="info" size="large" class="lowercase"
                        @click="overlay = !overlay">评论</v-btn>
                </div>
            </div>
            <hr class="my-2">
            <h3 v-if="comments ? comments.length : 0" class="text-xl mb-6">
                Comments
                <v-chip color="info">{{ comments.length }}</v-chip>
            </h3>
            <div v-for="comm in comments">
                <v-card class="pa-5 mb-5 border-light rounded-md elevation-10">
                    <!-- 头像 -->
                    <div class="flex gap-3 items-center">
                        <v-avatar size="30" v-if="comm.author.avatar" :image="comm.author.avatar"></v-avatar>
                        <v-avatar size="30" v-else color="red">
                            <span class="text-h6">AU</span>
                        </v-avatar>
                        <div class="flex items-center gap-3">
                            <h6 class="text-base">{{ comm.author.name }}</h6>
                            <span class="opacity-50 text-xs inline-flex items-center">
                                <svg data-v-1f0508b3="" xmlns="http://www.w3.org/2000/svg"
                                    class="icon icon-tabler icon-tabler-circle opacity-50 mr-1" width="8px" height="8px"
                                    viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="inherit"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <circle cx="12" cy="12" r="9"></circle>
                                </svg>
                                {{ format(new Date(comm.createdAt), 'MM/d') }}
                            </span>
                        </div>
                    </div>
                    <!-- 内容 -->
                    <div class="py-3 text-sm" v-text="comm.content">
                    </div>
                    <div class="flex my-1 items-center gap-3">
                        <v-btn style="text-transform: capitalize; letter-spacing: 0px;" @click="comm.open = !comm.open"
                            size="small" color="info" variant="tonal" icon>
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-back-up"
                                width="16px" height="16px" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                                fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M9 13l-4 -4l4 -4m-4 4h11a4 4 0 0 1 0 8h-1"></path>
                            </svg>
                            <v-tooltip size="small" activator="parent" location="top">回复</v-tooltip>
                        </v-btn>
                    </div>
                </v-card>
                <div class="ml-5">
                    <template v-for="re in comm.children">
                        <v-card class="pa-5 mb-5 border-light rounded-md elevation-10">
                            <!-- 头像 -->
                            <div class="flex gap-3 items-center">
                                <v-avatar size="30" v-if="re.author.avatar" :image="re.author.avatar"></v-avatar>
                                <v-avatar size="30" v-else color="red"><span class="text-h6">AU</span></v-avatar>
                                <div class="flex items-center gap-3">
                                    <h6 class="text-base">{{ re.author.name }}</h6>
                                    <span class="opacity-50 text-xs inline-flex items-center">
                                        <svg data-v-1f0508b3="" xmlns="http://www.w3.org/2000/svg"
                                            class="icon icon-tabler icon-tabler-circle opacity-50 mr-1" width="8px"
                                            height="8px" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                                            fill="inherit" stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                            <circle cx="12" cy="12" r="9"></circle>
                                        </svg>
                                        {{ format(new Date(re.createdAt), 'MM/d') }}
                                    </span>
                                </div>
                            </div>
                            <!-- 内容 -->
                            <div class="py-3 text-sm" v-text="re.content"></div>
                        </v-card>
                    </template>
                    <div v-if="comm.open">
                        <div class="flex mb-4 items-center gap-3">
                            <v-avatar rounded="0" size="40"
                                :image="avatar"></v-avatar>
                            <v-text-field density="compact" v-model="comment2.content" label="comment" color="info"
                                single-line hide-details variant="outlined"></v-text-field>
                            <v-btn variant="tonal" color="info" size="large" class="lowercase"
                                @click="() => { overlay2 = true; comment2.threadOf = comm.id }">回复</v-btn>
                        </div>
                    </div>
                </div>
            </div>
        </v-card>
    </div>
</template>

<style>
@import 'prismjs/themes/prism-tomorrow.css';
@import 'prismjs/plugins/toolbar/prism-toolbar.css';
@import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
@import 'prismjs/plugins/unescaped-markup/prism-unescaped-markup.css';
@import 'prismjs/plugins/show-invisibles/prism-show-invisibles.css';
@import 'prismjs/plugins/inline-color/prism-inline-color.css';
@import 'prismjs/plugins/autolinker/prism-autolinker.css';
@import 'prismjs/plugins/treeview/prism-treeview.css';

.elevation-10 {
    box-shadow: 0 0 2px #919eab4d, 0 12px 24px -4px #919eab1f !important;
}

pre {
    border-radius: 6px;
}

.vhtml img {
    margin: 10px 0;
    border-radius: 6px;
}
</style>
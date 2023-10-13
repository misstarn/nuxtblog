<script setup>

import articles from '~/queries/articles.gql'
import { format } from 'date-fns'

definePageMeta({
    keepalive: true,
    title: 'My Blog'
})

onMounted(async () => {
    setTimeout(getData, 50)
})

const snackbar = ref(false)
const snackbarText = ref('')
const timeout = ref(2000)

const blogs = ref([])
const page = ref(1)
const pageSize = ref(8)

const getData = async () => {
    const variables = {
        "pagination": {
            "page": page.value,
            "pageSize": pageSize.value
        },
        "sort": "createdAt:desc"
    }
    const { data, error, status } = await useAsyncQuery(articles, variables)

    // console.log(data, status)

    if (status.value == 'success') {
        blogs.value = data.value.articles
    }

    if (error.value) {
        console.error(error)
        throw error
    }
}

const baseUrl = useRuntimeConfig().public.baseUrl

</script>

<template>
    <div class="lg:p-8 p-4 max-w-[1200px] mx-auto">
        <v-snackbar v-model="snackbar" :timeout="timeout">
            {{ snackbarText }}

            <template v-slot:actions>
                <v-btn color="blue" variant="text" @click="snackbar = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
        <!-- <v-btn @click="getData">get</v-btn> -->
        <!-- part 1 -->
        <div class="w-full mb-8 rounded-sm">
            <div class="lg:px-8 px-4 py-4 lg:py-0 bg-[#ecf2ff] flex justify-between items-center">
                <div>
                    <h3 class="text-xl font-bold mb-2">Blog app</h3>
                    <a href="/">Get the latest news</a>
                </div>
                <div class="py-0 overflow-hidden lg:block hidden">
                    <div class="-mb-16 mt-3">
                        <img src="/imgs/ChatBc.png" alt="breadcrumb">
                    </div>
                </div>
            </div>
        </div>
        <!-- part 2 main -->
        <v-row>
            <template v-for="(article, index) in blogs.data">
                <!-- {{ article.attributes.title }} -->
                <v-col class="v-col-sm-12 v-col-md-12 v-col-lg-8 v-col-12" :cols="8" v-if="index == 0">
                    <v-card>
                        <v-img gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" cover height="400"
                            :src="baseUrl + article.attributes.cover.data.attributes.url">
                            <div class="p-6 flex justify-between flex-col h-[400px] relative">
                                <div class="flex justify-between items-center">
                                    <v-avatar size="40"
                                        :image="baseUrl + article.attributes.author.data.attributes.avatar.data.attributes.url"></v-avatar>
                                    <v-chip size="small">
                                        {{ article.attributes.category.data.attributes.name }}
                                    </v-chip>
                                </div>
                                <div>
                                    <nuxt-link :to="`/${article.attributes.slug}`">
                                        <div class="text-2xl my-6 text-white line-clamp-3">
                                            {{ article.attributes.title }}
                                        </div>
                                    </nuxt-link>
                                    <div class="flex items-center justify-between text-white">
                                        <div class="flex items-center">
                                            <div class="flex items-center">
                                                <v-avatar class="text-white" style="width: 18px; height: 18px;">
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                        class="icon icon-tabler icon-tabler-eye" width="24px" height="24px"
                                                        viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                                                        fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                        <circle cx="12" cy="12" r="2"></circle>
                                                        <path
                                                            d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7">
                                                        </path>
                                                    </svg>
                                                </v-avatar>
                                                <span class="ml-2 text-sm">{{ article.attributes.read }}</span>
                                            </div>
                                            <div class="flex items-center">

                                                <v-avatar class="text-white ml-6" style="width: 18px; height: 18px;">
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                        class="icon icon-tabler icon-tabler-message-2" width="24px"
                                                        height="24px" viewBox="0 0 24 24" stroke-width="2"
                                                        stroke="currentColor" fill="none" stroke-linecap="round"
                                                        stroke-linejoin="round">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                        <path
                                                            d="M12 20l-3 -3h-2a3 3 0 0 1 -3 -3v-6a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-2l-3 3">
                                                        </path>
                                                        <line x1="8" y1="9" x2="16" y2="9"></line>
                                                        <line x1="8" y1="13" x2="14" y2="13"></line>
                                                    </svg>
                                                </v-avatar>
                                                <span class="ml-2 text-sm">{{ article.attributes.commentCount }}</span>
                                            </div>
                                        </div>
                                        <div class="flex items-center">
                                            <v-avatar class="text-white" style="width: 10px; height: 10px;">
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    class="icon icon-tabler icon-tabler-circle" width="24px" height="24px"
                                                    viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                                                    stroke-linecap="round" stroke-linejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <circle cx="12" cy="12" r="9"></circle>
                                                </svg>
                                            </v-avatar>
                                            <span class="ml-2 text-sm">{{ format(new Date(article.attributes.createdAt), 'MM/d') }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </v-img>

                    </v-card>
                </v-col>
                <v-col class="v-col-sm-12 v-col-md-12 v-col-lg-4 v-col-12" :cols="4" v-else-if="index == 1">
                    <v-card>
                        <v-img gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" cover height="400"
                            :src="baseUrl + article.attributes.cover.data.attributes.url">
                            <div class="p-6 flex justify-between flex-col h-[400px] relative">
                                <div class="flex justify-between items-center">
                                    <v-avatar size="40"
                                        :image="baseUrl + article.attributes.author.data.attributes.avatar.data.attributes.url"></v-avatar>
                                    <v-chip size="small">
                                        {{ article.attributes.category.data.attributes.name }}
                                    </v-chip>
                                </div>
                                <div>
                                    <nuxt-link :to="`/${article.attributes.slug}`">
                                        <div class="text-2xl my-6 text-white line-clamp-3">
                                            {{ article.attributes.title }}
                                        </div>
                                    </nuxt-link>
                                    <div class="flex items-center justify-between text-white">
                                        <div class="flex items-center">
                                            <div class="flex items-center">
                                                <v-avatar class="text-white" style="width: 18px; height: 18px;">
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                        class="icon icon-tabler icon-tabler-eye" width="24px" height="24px"
                                                        viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                                                        fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                        <circle cx="12" cy="12" r="2"></circle>
                                                        <path
                                                            d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7">
                                                        </path>
                                                    </svg>
                                                </v-avatar>
                                                <span class="ml-2 text-sm">{{ article.attributes.read }}</span>
                                            </div>
                                            <div class="flex items-center">
                                                <v-avatar class="text-white ml-6" style="width: 18px; height: 18px;">
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                        class="icon icon-tabler icon-tabler-message-2" width="24px"
                                                        height="24px" viewBox="0 0 24 24" stroke-width="2"
                                                        stroke="currentColor" fill="none" stroke-linecap="round"
                                                        stroke-linejoin="round">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                        <path
                                                            d="M12 20l-3 -3h-2a3 3 0 0 1 -3 -3v-6a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-2l-3 3">
                                                        </path>
                                                        <line x1="8" y1="9" x2="16" y2="9"></line>
                                                        <line x1="8" y1="13" x2="14" y2="13"></line>
                                                    </svg>
                                                </v-avatar>
                                                <span class="ml-2 text-sm">{{ article.attributes.commentCount }}</span>
                                            </div>
                                        </div>
                                        <div class="flex items-center">
                                            <v-avatar class="text-white" style="width: 10px; height: 10px;">
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    class="icon icon-tabler icon-tabler-circle" width="24px" height="24px"
                                                    viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                                                    stroke-linecap="round" stroke-linejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <circle cx="12" cy="12" r="9"></circle>
                                                </svg>
                                            </v-avatar>
                                            <span class="ml-2 text-sm">{{ format(new Date(article.attributes.createdAt), 'MM/d') }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </v-img>

                    </v-card>
                </v-col>
                <v-col class="v-col-sm-4 v-col-md-4 v-col-12" cols="4" v-else>
                    <v-card>
                        <div>
                            <nuxt-link :to="`/${article.attributes.slug}`">
                                <v-img class="items-end text-right" height="250" cover
                                    :src="baseUrl + article.attributes.cover.data.attributes.url">
                                    <v-card-item style="padding: 30px 30px 24px;">
                                        <v-chip size="small">2 min read</v-chip>
                                    </v-card-item>
                                </v-img>
                            </nuxt-link>
                            <v-avatar size="40" class="-mt-7 mx-6"
                                :image="baseUrl + article.attributes.author.data.attributes.avatar.data.attributes.url"></v-avatar>
                        </div>
                        <v-card-item class="px-6 pt-4" style="padding: 30px 30px 24px;">
                            <v-chip size="small">{{ article.attributes.category.data.attributes.name }}</v-chip>
                            <div class="h-20">
                                <h5 class="text-lg my-6 line-clamp-2">
                                    <nuxt-link :to="`/${article.attributes.slug}`">{{ article.attributes.title
                                    }}</nuxt-link>
                                </h5>
                            </div>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <div class="flex items-center">
                                        <v-avatar class="" style="width: 18px; height: 18px;">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-eye"
                                                width="24px" height="24px" viewBox="0 0 24 24" stroke-width="2"
                                                stroke="currentColor" fill="none" stroke-linecap="round"
                                                stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                <circle cx="12" cy="12" r="2"></circle>
                                                <path
                                                    d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7">
                                                </path>
                                            </svg>
                                        </v-avatar>
                                        <span class="ml-2 text-sm">{{ article.attributes.read }}</span>
                                    </div>
                                    <div class="flex items-center">
                                        <v-avatar class=" ml-6" style="width: 18px; height: 18px;">
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                class="icon icon-tabler icon-tabler-message-2" width="24px" height="24px"
                                                viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                                                stroke-linecap="round" stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                <path
                                                    d="M12 20l-3 -3h-2a3 3 0 0 1 -3 -3v-6a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-2l-3 3">
                                                </path>
                                                <line x1="8" y1="9" x2="16" y2="9"></line>
                                                <line x1="8" y1="13" x2="14" y2="13"></line>
                                            </svg>
                                        </v-avatar>
                                        <span class="ml-2 text-sm">{{ article.attributes.commentCount }}</span>
                                    </div>
                                </div>
                                <div class="flex items-center">
                                    <v-avatar class="" style="width: 10px; height: 10px;">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle"
                                            width="24px" height="24px" viewBox="0 0 24 24" stroke-width="2"
                                            stroke="currentColor" fill="none" stroke-linecap="round"
                                            stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                            <circle cx="12" cy="12" r="9"></circle>
                                        </svg>
                                    </v-avatar>
                                    <span class="ml-2 text-sm">{{ format(new Date(article.attributes.createdAt), 'MM/d') }}</span>
                                </div>
                            </div>
                        </v-card-item>
                    </v-card>
                </v-col>
            </template>
        </v-row>
        <div class="text-center">
                <v-row justify="center">
                    <v-col cols="12" class="px-0">
                        <v-container class="max-width px-0">
                            <v-pagination v-model="page" class="my-4" @update:modelValue="getData" v-if="blogs.meta" :length="blogs.meta.pagination.pageCount"></v-pagination>
                        </v-container>
                    </v-col>
                </v-row>
        </div>
    </div>
</template>
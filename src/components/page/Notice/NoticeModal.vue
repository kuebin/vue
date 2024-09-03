<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="container">
                <label> 제목 :<input type="text" v-model="noticeDetail.noti_title"/> </label>
                <label>
                    내용 :
                    <input type="text" v-model="noticeDetail.noti_content"/>
                </label>
                파일 :<input type="file" style="display: none" id="fileInput" @change="handlerFile"/>
                <label class="img-label" htmlFor="fileInput"> 파일 첨부하기 </label>
                <div @click="fileDownload">
                    <div v-if="imageUrl">
                <div @click="fileDownload">
                    <div v-if="imageUrl">
                        <label>미리보기</label>
                        <img :src="imageUrl"/>
                    </div>
                    <div v-else>
                        <label>파일명</label>
                        {{ fileData?.name || noticeDetail?.file_name }}
                    </div>
                </div>
                <div class="button-box">
                    <button @click=" props.noticeSeq > 0 ? noticeUpdate() : noticeSave()">{{ props.noticeSeq > 0 ? '수정' : '저장' }}</button>
                    <button v-if="props.noticeSeq > 0" @click="noticeDelete()">삭제</button>
                    <button @click="modalState.setModalState">나가기</button>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { useModalStore } from '@/stores/modalState';
import { useUserInfo } from '@/stores/userInfo';
import axios from 'axios';

    const props = defineProps(['noticeSeq']);
    const noticeDetail = ref(
        new Object({
            noti_title : "",
            noti_content : ""
        })
    )
    const modalState = useModalStore();
    const emit = defineEmits(['modalClose', 'postSuccess'])
    const userInfo = useUserInfo();
    const imageUrl = ref("");
    const fileData = ref()

    const searchDetail = ()=>{
        axios
            .post(`/api/board/noticeDetail.do`, {noticeSeq : props.noticeSeq})
            .then((res)=>{
                noticeDetail.value = res.data.detailValue;
                if(noticeDetail.value.file_ext === 'jpg' || noticeDetail.value.file_ext === "gif" || noticeDetail.value.file_ext === 'png'){
                    fileDownload('preview')
                }
            })
    }

    onMounted(()=>{
        props.noticeSeq ? searchDetail() : null
    })

    onUnmounted(()=>{
        emit("modalClose")
    })  

    const noticeSave = ()=>{

        const textData = {
            title : noticeDetail.value.noti_title,
            content : noticeDetail.value.noti_content, 
            loginId : userInfo.user.loginId
        }

        const fileForm = new FormData();
        if(fileData.value) fileForm.append("file", fileData.value);
        fileForm.append(
            'text', 
            new Blob([JSON.stringify(textData)], {
                type : "application/json"
            })
        );

        axios  
            .post(`/api/board/noticeFileSaveJson.do`, fileForm)
            .then((res)=>{
                if(res.data.result === 'success'){
                    modalState.setModalState();
                    emit('postSuccess');
                }
            })
    }
    
    const noticeUpdate = ()=>{
        const textData = {
            title : noticeDetail.value.noti_title,
            content : noticeDetail.value.noti_content, 
            noticeSeq : props.noticeSeq
        }

        const fileForm = new FormData();
        if(fileData.value) fileForm.append("file", fileData.value);
        fileForm.append(
            'text', 
            new Blob([JSON.stringify(textData)], {
                type : "application/json"
            })
        );

        axios  
            .post(`/api/board/noticeFileUpdateJson`, fileForm)
            .then((res)=>{
                if(res.data.result === 'success'){
                    modalState.setModalState();
                    emit('postSuccess');
                }
            })
    }
    const noticeDelete = ()=>{
        axios  
            .post(`/api/board/noticeDelete.do`, {
                noticeSeq : props.noticeSeq
            })
            .then((res)=>{
                if(res.data.result === 'success'){
                    modalState.setModalState();
                    emit('postSuccess');
                }
            })
    }

    const handlerFile = (e)=>{
        const fileInfo = e.target.files;

        if(fileInfo.length){
            const fileInfoSplit = fileInfo[0].name.split(".")
            const fileExtension = fileInfoSplit[1].toLowerCase();
            if(fileExtension === 'jpg' || fileExtension === "gif" || fileExtension === 'png'){
                imageUrl.value = URL.createObjectURL(fileInfo[0])
            }
            fileData.value = fileInfo[0]
        }
    }
    
    const fileDownload = async (flag)=>{
        let param = new URLSearchParams();
        param.append('noticeSeq', props.noticeSeq);

        const postAction = {
            url : '/api/board/noticeDownload.do',
            method : 'post',
            data : param, 
            responseType : 'blob'
        }

        await axios(postAction).then((res)=>{
            const url = window.URL.createObjectURL(new Blob([res.data]))
            if(flag === 'preview') {
                imageUrl.value = url
            }else{
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', noticeDetail.value.file_name)
                document.body.appendChild(link)
                link.click();

                link.remove();
            }
        })
    }

</script>

<style lang="scss" scoped>
.backdrop {
    top: 0%;
    left: 0%;
    width: 100%;
    height: 100%;
    position: fixed;
    display: flex;
    flex-flow: row wrep;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
    font-weight: bold;
}

label {
    display: flex;
    flex-direction: column;
}

input[type="text"] {
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
}

.container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
    position: relative;
    width: 400px;
}

img {
    width: 100px;
    height: 100px;
}

.img-label {
    margin-top: 10px;
    padding: 6px 25px;
    background-color: #ccc;
    border-radius: 4px;
    color: rgba(0, 0, 0, 0.9);
    cursor: pointer;

    &:hover {
        background-color: #45a049;
        color: white;
    }

    &:active {
        background-color: #3e8e41;
        box-shadow: 0 2px #666;
        transform: translateY(2px);
    }
}

.button-box {
    text-align: right;
    margin-top: 10px;
}
button {
    background-color: #3bb2ea;
    border: none;
    color: white;
    padding: 10px 22px;
    text-align: right;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 12px;
    box-shadow: 0 4px #999;
    transition: 0.3s;

    &:hover {
        background-color: #45a049;
    }

    &:active {
        background-color: #3e8e41;
        box-shadow: 0 2px #666;
        transform: translateY(2px);
    }
}
</style>

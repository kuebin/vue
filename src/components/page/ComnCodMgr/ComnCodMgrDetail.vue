<template>
    <ContextBox>상세코드 조회</ContextBox>
    <button @click="$router.go(-1)">뒤로가기</button>
    <button @click="handlerModal()">신규등록</button>
    <div v-if="isLoading">기다려주세요</div>
    <table v-else>
        <thead>
            <tr>
                <th>그룹코드</th>
                <th>상세코드</th>
                <th>상세코드명</th>
                <th>상세코드 설명</th>
                <th>사용여부</th>
            </tr>
        </thead>
        <tbody>
            <template v-if="detailList?.listComnDtlCodModel.length > 0">
                <tr v-for="detail in detailList?.listComnDtlCodModel" :key="detail.dtl_cod" @click="handlerModal(detail.dtl_cod)">
                    <td>{{ detail.grp_cod }}</td>
                    <td>{{ detail.dtl_cod }}</td>
                    <td>{{ detail.dtl_cod_nm }}</td>
                    <td>{{ detail.dtl_cod_eplti }}</td>
                    <td>{{ detail.use_poa }}</td>
                </tr>
            </template>
            <template>
                <tr>
                    <td colspan="5">데이터가 없습니다.</td>
                </tr>
            </template>
        </tbody>
    </table>
    <ComnCodMgrDetailModal v-if="modalState.modalState" :grpCod="params.id" :grpCodNm="name" :detailProp="detailProp"></ComnCodMgrDetailModal>
</template>

<script setup>
import { useQuery } from "@tanstack/vue-query";
import axios from "axios";
import ComnCodMgrDetailModal from "./ComnCodMgrDetailModal.vue";
import { useModalStore } from "@/stores/modalState";

//메인에서 router id, state grpCode, grpNm받자
const route = useRoute(); //뭐가 엄청 많은데 그 안에서 params를 가져오고 싶음
const { params } = useRoute(); //Id만 가져옴
//console.log(route);
//console.log(params);//{id: 'ㅇㅇㅇ'}
//const name = history;
//console.log(history);
const { nm: name } = history.state; //name만 가져옴
const modalState = useModalStore();
const detailProp = ref();

const searchDetail = async () => {
    const result = await axios.post("/api/system/listComnDtlCodJson.do", {
        //searchDetail용 파라미터 3개필요함
        currentPage: 1,
        pageSize: 5,
        grp_cod: params.id
    });
    return result.data;
};

const { data: detailList, isLoading } = useQuery({
    queryKey: ["detailList"],
    queryFn: searchDetail
});

const handlerModal = (detailCod) => {
    modalState.setModalState();
    detailCod ? (detailProp.value = detailCod) : (detailProp.value = 'create')
};
</script>

<style lang="scss" scoped>
table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0px 0px 0px;
    font-size: 18px;
    text-align: left;

    th,
    td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid #ddd;
        text-align: center;
    }

    th {
        background-color: #2676bf;
        color: #ddd;
    }

    /* 테이블 올렸을 때 */
    tbody tr:hover {
        background-color: #d3d3d3;
        opacity: 0.9;
        cursor: pointer;
    }
}
button {
    text-align: center;
    text-decoration: none;
    display: block;
    border: none;
    color: white;
    width: 80px;
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: 12px;
    margin: 10px 2px;
    cursor: pointer;
    border-radius: 12px;
    box-shadow: 0 4px #999;
    background-color: #3bb2ea;
    float: inline-end;

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

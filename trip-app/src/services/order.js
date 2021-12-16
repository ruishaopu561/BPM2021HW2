import {ORDER} from '@/services/api'
import {request, METHOD} from '@/utils/request'

export async function createOrder(order) {
  console.log(order, order.ID)
  let data = {
    ID: order.name,
    enterpriseID: order.storename,
    time: order.ordertime,
    money: order.value,
    number: order.number,
    comment: '这是一段评价...',
    status: 1,
    type: order.type
  }
  console.log(data)
  return request(ORDER, METHOD.POST, data, 'Content-Type=application/json')
}

export async function updateOrder(order) {
  let data = {
    ID: order.ID,
    enterpriseID: order.enterpriseID,
    time: order.time,
    money: order.money,
    number: order.number,
    comment: order.comment,
    status: order.status,
    type: order.type
  }
  console.log(data)
  return request(ORDER + '/3', METHOD.PUT, data, {'content-type': 'application/json'})
}

export async function fetchOrder(id) {
    console.log(id)
    return request(ORDER + '/' + id, METHOD.GET)
}

export default {createOrder, updateOrder, fetchOrder}
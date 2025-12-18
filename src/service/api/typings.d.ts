declare namespace API {
  type BaseResponseString_ = {
    code?: number
    data?: string
    message?: string
  }

  type BaseResponseLong_ = {
    code?: number
    data?: number
    message?: string
  }

  type LoginUserVO = {
    id?: string
    userName?: string
    userAvatar?: string
    userProfile?: string
    userRole?: number
    createTime?: string
  }

  type BaseResponseLoginUserVO_ = {
    code?: number
    data?: LoginUserVO
    message?: string
  }

  type UserLoginRequest = {
    /** 用户账号 */
    userAccount?: string
    /** 用户密码 */
    userPassword?: string
  }

  type UserRegisterRequest = {
    /** 用户账号 */
    userAccount?: string
    /** 用户密码 */
    userPassword?: string
    checkPassword?: string
  }

  type BaseResponseBoolean_ = {
    code?: number
    data?: boolean
    message?: string
  }

  type UserVO = {
    id?: number
    userName?: string
    userAccount?: string
    userAvatar?: string
    userRole?: number
    userProfile?: string
    createTime?: string
    updateTime?: string
    editTime?: string
  }

  type UserQueryRequest = {
    current?: number
    pageSize?: number
    id?: number
    userName?: string
    userAccount?: string
    userRole?: number
  }

  type PageUserVO_ = {
    records?: UserVO[]
    total?: number
    current?: number
    size?: number
    pages?: number
  }

  type BaseResponsePageUserVO_ = {
    code?: number
    data?: PageUserVO_
    message?: string
  }

  type DeleteRequest = {
    id?: number
  }

}

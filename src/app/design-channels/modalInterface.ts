export interface modalData{
    title: string,
    contenturl: string,
    message?: any,
    buttonName: string,

}
export interface showThumbnail{
    "thumbnail_desktop":string,
    "thumbnail_mobile":string
}

export interface failSafeinfo{
    "json":any,
    "html":any,
    "failsafeSubObj":failsafeSubData,
}
 export interface failsafeSubData{
     "preHeader":string,
     "subject":string,
 }
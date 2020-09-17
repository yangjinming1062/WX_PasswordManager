// pages/ForShow/ForShow.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    ShowPassword: {
      type: Boolean,
      value: false,
    },
    item: {
      type: Object,
      value: {},
    },
    theme:{
      type:String,
      value:'white'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    item:null
  },
  options: {
    styleIsolation: 'shared'
  },
  /**
   * 组件的方法列表
   */
  methods: {
    copyIDTap:function(e){
      wx.setClipboardData({
        data: this.properties.item.ID,
      })
    },
    copyPwTap:function(e){
      wx.setClipboardData({
        data: this.properties.item.Password,
      })
    },
    DelTap: function(){
      this.triggerEvent('Del', this.properties.item.keyword)
    },
    ModTap: function(){
      this.triggerEvent('Mod', this.properties.item.keyword)
    }
  }
})

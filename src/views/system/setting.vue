<template>
  <div class="xg-main system-page">
    <el-tabs :tab-position="tabPosition">
      <el-tab-pane v-if="$tools.checkAdminPower('system', 'base')" label="基础设置">
        <div class="form-item">
          <span class="form-label">新用户奖励：</span>
          <el-input type="number" v-model="form.base_amount">
            <template slot="append">元</template>
          </el-input>
        </div>
        <div class="form-item">
          <span class="form-label">实名认证需传证件照：</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.show_certification_IDcard"></el-switch>
          <span class="text-gray">若开启，用户需要提交认证资料时需上传证件照</span>
        </div>
        <div class="form-item">
          <span class="form-label">实名认证需填证件号：</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.show_certification_card_number"></el-switch>
          <span class="text-gray">若开启，用户需要提交认证资料时需填写证件号</span>
        </div>
        <div class="form-item">
          <span class="form-label">是否显示账号注册入口</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.show_register_entry"></el-switch>
          <span class="text-gray">若开启，用户可通过账号密码注册，小程序除外</span>
        </div>
        <div class="form-item">
          <span class="form-label">是否显示手机验证码登录入口</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.show_phone_login"></el-switch>
          <span class="text-gray">若开启，用户可通过手机验证码登录，小程序除外</span>
        </div>
        <div class="form-item">
          <span class="form-label">是否显示绑定手机号入口</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.show_bind_phone"></el-switch>
          <span class="text-gray">若开启，用户可在个人中心绑定手机号，小程序除外</span>
        </div>
        <div class="form-item">
          <span class="form-label">是否显示找回密码入口</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.show_find_password"></el-switch>
          <span class="text-gray">若开启，用户可通过找回密码，小程序除外</span>
        </div>
        <div class="form-item">
          <span class="form-label">APP端是否显示微信登录入口</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.show_app_wechat_login"></el-switch>
          <span class="text-gray">若开启，APP端用户可通过微信登录</span>
        </div>
        <div class="form-item">
          <span class="form-label">APP端是否显示苹果登录入口</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.show_app_apple_login"></el-switch>
          <span class="text-gray">若开启，iOS APP端用户可通过苹果登录</span>
        </div>
        <div class="form-item">
          <span class="form-label">是否强制绑定手机号</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.need_bind_phone"></el-switch>
          <span class="text-gray">若开启，用户需绑定手机号后才能继续使用，小程序除外</span>
        </div>
        <div class="form-item">
          <span class="form-label">落地页使用手机号注册</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.use_phone_register"></el-switch>
          <span class="text-gray">若开启，落地页则使用手机号注册，否则使用账号密码注册</span>
        </div>
        <div class="form-item">
          <span class="form-label">客服：</span>
          <el-input v-model="form.contact"></el-input>
        <p class="text-gray">将展示在H5端。另外，绑定了小程序客服的微信号，可以
          <a target="_blank" href="https://mpkf.weixin.qq.com/" class="text-blue">登录网页端客服</a> 或 
          <el-popover
            class="color-blue"
            trigger="hover">
            <img src="//res.wx.qq.com/op_res/XRf1UK4VRTEij8H7rFqgnitV_nrpa0eIiaA3CWOmewE-gJdUw8SwbnnKmOXcTHbF%0A">
            <a slot="reference" class="text-blue">移动端小程序客服</a>
          </el-popover> 进行客服沟通。详情查看
          <a target="_blank" class="text-blue" href="https://developers.weixin.qq.com/miniprogram/introduction/custom.html#%E7%BB%91%E5%AE%9A%E5%AE%A2%E6%9C%8D%E4%BA%BA%E5%91%98">
          使用说明
          </a>
        </p>
        </div>
        <div class="form-item">
          <span class="form-label">H5链接：</span>
          <el-input v-model="form.h5"></el-input>
          <span class="text-gray">请联系开发者获取H5链接，留空则不在小程序端展示</span>
        </div>
        <div class="form-item">
          <span class="form-label">安卓下载地址：</span>
          <el-input v-model="form.android_download_url"></el-input>
        </div>
        <div class="form-item">
          <span class="form-label">安卓下载二维码：</span>
          <el-upload
            drag
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAndroidCodeSuccess"
            :on-error="handleError"
            :before-upload="beforeImageUpload"
            :data="qiniuData">
            <img v-if="form.android_download_code" :src="form.android_download_code | getQiniuFullUrl">
            <div v-else class="el-default">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                <em>点击上传</em>
              </div>
            </div>
          </el-upload>
        </div>
        <div class="form-item">
          <span class="form-label">iOS下载地址：</span>
          <el-input v-model="form.ios_download_url"></el-input>
        </div>
        <div class="form-item">
          <span class="form-label">iOS下载二维码：</span>
          <el-upload
            drag
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleIOSCodeSuccess"
            :on-error="handleError"
            :before-upload="beforeImageUpload"
            :data="qiniuData">
            <img v-if="form.ios_download_code" :src="form.ios_download_code | getQiniuFullUrl">
            <div v-else class="el-default">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                <em>点击上传</em>
              </div>
            </div>
          </el-upload>
        </div>
        <div class="form-item">
          <span class="form-label">关于我们：</span>
          <el-input
            type="textarea"
            :autosize="{ minRows: 6}"
            placeholder="请输入关于我们内容"
            v-model="form.about_us">
          </el-input>
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="$tools.checkAdminPower('system', 'task')" label="任务设置">
        <div class="form-item">
          <span class="form-label">最大审核时间：</span>
          <el-input type="number" v-model="form.max_review_time">
            <template slot="append">分钟</template>
          </el-input>
          <p class="text-gray">发布任务时最大可设置的审核时间</p>
        </div>
        <div class="form-item">
          <span class="form-label">最小时间限制：</span>
          <el-input type="number" v-model="form.min_limit_time">
            <template slot="append">分钟</template>
          </el-input>
          <p class="text-gray">用户发布任务时可设置的最小时间限制</p>
        </div>
        <div class="form-item">
          <span class="form-label">最大时间限制：</span>
          <el-input type="number" v-model="form.max_limit_time">
            <template slot="append">分钟</template>
          </el-input>
          <p class="text-gray">用户发布任务时可设置的最大时间限制，设为-1则不限制</p>
        </div>
        <div class="form-item">
          <span class="form-label">最小任务金额：</span>
          <el-input type="number" v-model="form.min_task_price">
            <template slot="append">元</template>
          </el-input>
          <p class="text-gray">用户发布任务时可设置的最小任务金额</p>
        </div>
        <div class="form-item">
          <span class="form-label">最大任务金额：</span>
          <el-input type="number" v-model="form.max_task_price">
            <template slot="append">元</template>
          </el-input>
          <p class="text-gray">用户发布任务时可设置的最大任务金额，设为-1则不限制</p>
        </div>
        <div class="form-item">
          <span class="form-label">上架需审核：</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.need_review"></el-switch>
          <span class="text-gray">若开启，用户发布任务时需管理员审核通过后才可上架</span>
        </div>
        <div class="form-item">
          <span class="form-label">按百分比收取：</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.is_ratio"></el-switch>
          <span class="text-gray">若开启，用户发布任务时按任务总金额的百分比来缴纳服务费</span>
        </div>
        <div class="form-item">
          <span class="form-label">发布任务服务费：</span>
          <el-input type="number" v-model="form.task_price">
            <template slot="append">{{form.is_ratio?'%':'元'}}</template>
          </el-input>
        </div>
        <div class="form-item">
          <span class="form-label">领任务需实名认证：</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.need_certification"></el-switch>
          <span class="text-gray">若开启，用户需实名认证才可以领取任务</span>
        </div>
        <div class="form-item">
          <span class="form-label">发任务需实名认证：</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.publish_need_certification"></el-switch>
          <span class="text-gray">若开启，用户需实名认证才可以发布任务</span>
        </div>
        <div class="form-item">
          <span class="form-label">审核可申诉：</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.open_appeal"></el-switch>
          <span class="text-gray">若开启，当任务审核者驳回了审核，用户可发起申诉，由平台介入处理</span>
        </div>
        <div class="form-item">
          <span class="form-label">启用任务位置：</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.enable_location"></el-switch>
          <span class="text-gray">若开启，发布任务可选择位置，用户可根据距离排序查看任务列表</span>
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="$tools.checkAdminPower('system', 'sort')" label="竞价排名">
        <div class="form-item">
          <span class="form-label">默认刷新次数：</span><el-input type="number" v-model="form.refresh_count"></el-input>
          <p class="text-gray">用户初始的任务刷新次数，修改后只对新用户生效</p>
        </div>
        <div class="form-item">
          <span class="form-label">首页推荐费用：</span>
          <el-input type="number" v-model="form.recommend_price">
            <template slot="append">元/小时</template>
          </el-input>
        </div>
        <div class="form-item">
          <span class="form-label">置顶费用：</span>
          <el-input type="number" v-model="form.top_price">
            <template slot="append">元/小时</template>
          </el-input>
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="$tools.checkAdminPower('system', 'entry')" label="功能开关">
        <div class="form-item">
          <span class="form-label">首页标签：</span>
          <el-checkbox :true-label="1" :false-label="0" v-model="form.show_recommend">推荐</el-checkbox>
          <el-checkbox :true-label="1" :false-label="0" v-model="form.show_high">高价</el-checkbox>
          <el-checkbox :true-label="1" :false-label="0" v-model="form.show_simple">简单</el-checkbox>
        </div>
        <div class="form-item">
          <span class="form-label">发布任务：</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.show_publish"></el-switch>
        </div>
        <div class="form-item">
          <span class="form-label">付费刷新：</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.show_refresh"></el-switch>
        </div>
        <div class="form-item">
          <span class="form-label">实名认证：</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.show_certification"></el-switch>
        </div>
        <div class="form-item">
          <span class="form-label">我的钱包：</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.show_wallet"></el-switch>
        </div>
        <div class="form-item">
          <span class="form-label">立即提现：</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.show_withdraw"></el-switch>
          <span class="text-gray">仅控制是否在个人中心显示“立即提现”入口</span>
        </div>
        <div class="form-item">
          <span class="form-label">立即充值：</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.show_recharge"></el-switch>
          <span class="text-gray">仅控制是否在个人中心显示“立即充值”入口</span>
        </div>
        <div class="form-item">
          <span class="form-label">立即充值：</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.show_wallet_recharge"></el-switch>
          <span class="text-gray">仅控制是否在我的钱包显示“立即充值”入口</span>
        </div>
        <div class="form-item">
          <span class="form-label">关联账号：</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.show_connect"></el-switch>
          <span class="text-gray">开启后，需到基础设置填写H5版链接，入口才会显示</span>
        </div>
        <div class="form-item">
          <span class="form-label">我的团队：</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.show_invite"></el-switch>
        </div>
        <div class="form-item">
          <span class="form-label">联系客服：</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.show_contact"></el-switch>
        </div>
        <div class="form-item">
          <span class="form-label">关于我们：</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.show_about"></el-switch>
        </div>
        <div class="form-item">
          <span class="form-label">简洁模式：</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.is_review"></el-switch>
          <span class="text-gray">将隐藏部分模块，保留核心功能和任务</span>
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="$tools.checkAdminPower('system', 'invite')" label="邀请设置">
        <div class="form-item">
          <span class="form-label">邀请规则：</span>
          <el-input
            type="textarea"
            autosize
            placeholder="请输入邀请规则"
            v-model="form.invite_rule">
          </el-input>
        </div>
        <div class="form-item">
          <span class="form-label">邀请文案：</span>
          <el-input
            type="textarea"
            autosize
            placeholder="请输入邀请文案"
            v-model="form.invite_text">
          </el-input>
          <p class="text-gray">邀请链接将拼接在邀请文案后面</p>
        </div>
        <div class="form-item">
          <span class="form-label">落地页注册成功后跳转的地址：</span>
          <el-input type="text" v-model="form.download_page"></el-input>
        </div>
        <div class="form-item">
          <span class="form-label">邀请海报：</span>
          <el-upload
            drag
            :action="uploadUrl"
            class="poster"
            :show-file-list="false"
            :on-success="handlePosterSuccess"
            :on-error="handleError"
            :before-upload="beforeImageUpload"
            :data="qiniuData">
            <img v-if="form.invite_poster" :src="form.invite_poster | getQiniuFullUrl">
            <div v-else class="el-default">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或
                <em>点击上传</em>
              </div>
            </div>
            <div class="el-upload__tip" slot="tip">图片尺寸为1242*2208，只能上传jpg/png文件，且不超过5MB</div>
          </el-upload>
        </div>
        <div class="form-item">
          <span class="form-label">二维码宽度：</span>
          <el-input
            type="number"
            placeholder="请输入二维码宽度"
            v-model="form.poster_code_width">
            <template slot="append">px</template>
          </el-input>
        </div>
        <div class="form-item">
          <span class="form-label">二维码高度：</span>
          <el-input
            type="number"
            placeholder="请输入二维码高度"
            v-model="form.poster_code_height">
            <template slot="append">px</template>
          </el-input>
        </div>
        <div class="form-item">
          <span class="form-label">二维码与海报左边的距离：</span>
          <el-input
            type="number"
            placeholder="请输入二维码与海报左边的距离"
            v-model="form.poster_code_left">
            <template slot="append">px</template>
          </el-input>
        </div>
        <div class="form-item">
          <span class="form-label">二维码与海报顶部的距离：</span>
          <el-input
            type="number"
            placeholder="请输入二维码与海报顶部的距离"
            v-model="form.poster_code_top">
            <template slot="append">px</template>
          </el-input>
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="$tools.checkAdminPower('system', 'withdraw')" label="提现设置">
        <div class="form-item">
          <span class="form-label">提现方式：</span>
          <el-checkbox v-model="form.show_alipay_withdraw" :true-label="1" :false-label="0">支付宝</el-checkbox>
          <el-checkbox v-model="form.show_wechat_withdraw" :true-label="1" :false-label="0">微信</el-checkbox>
          <el-checkbox v-model="form.show_bank_withdraw" :true-label="1" :false-label="0">银行卡</el-checkbox>
        </div>
        <div class="form-item">
          <span class="form-label">需实名认证：</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.withdraw_need_certificate"></el-switch>
          <span class="text-gray">若开启，用户需要提交认证资料，且审核通过后才可以提现</span>
        </div>
        <div class="form-item">
          <span class="form-label">企业付款到微信：</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.pay_to_wechat"></el-switch>
          <span class="text-gray">若开启，微信商户号开通付款到微信且用户绑定了微信，管理员审核提现时可自动付款</span>
        </div>
        <div class="form-item">
          <span class="form-label">企业付款到支付宝：</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.pay_to_alipay"></el-switch>
          <span class="text-gray">若开启，支付宝商户号开通转账支付宝账户，管理员审核提现时可自动付款</span>
        </div>
        <div class="form-item">
          <span class="form-label">提现需绑定微信：</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.withdraw_need_bind_wechat"></el-switch>
          <span class="text-gray">若开启，用户必须绑定了微信后才能提交提现申请</span>
        </div>
        <div class="form-item">
          <span class="form-label">提现公告：</span>
          <el-input type="textarea" v-model="form.withdraw_notice"></el-input>
        </div>
        <div class="form-item">
          <span class="form-label">费率：</span>
          <el-input type="number" v-model="form.commission_ratio">
            <template slot="append">%</template>
          </el-input>
        </div>
        <div class="form-item">
          <span class="form-label">首次提现费率：</span>
          <el-input type="number" v-model="form.first_commission_ratio">
            <template slot="append">%</template>
          </el-input>
        </div>
        <div class="form-item">
          <span class="form-label">最少金额：</span>
          <el-input type="number" v-model="form.withdraw_min">
            <template slot="append">元</template>
          </el-input>
        </div>
        <div class="form-item">
          <span class="form-label">最大金额：</span>
          <el-input type="number" v-model="form.withdraw_max">
            <template slot="append">元</template>
          </el-input>
        </div>
        <div class="form-item">
          <span class="form-label">首次提现最少金额：</span>
          <el-input type="number" v-model="form.first_withdraw_min">
            <template slot="append">元</template>
          </el-input>
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="$tools.checkAdminPower('system', 'recharge')" label="充值设置">
        <div class="form-item">
          <span class="form-label">到账比例：</span>
          <el-input type="number" v-model="form.recharge_rate">
            <template slot="append">%</template>
          </el-input>
          <div class="text-gray">仅对用户端充值有效，管理端按实际金额充值到账</div>
          <div class="text-gray">如: 设置为200%则相当于用户充100送100</div>
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="$tools.checkAdminPower('system', 'score')" label="积分设置">
        <div class="form-item">
          <span class="form-label">对人民币汇率：</span>
          <el-input v-model="form.score_rate"></el-input>
          <span class="text-gray">100积分换{{100*form.score_rate}}人民币</span>
        </div>
        <div class="form-item">
          <span class="form-label">可使用积分抵扣发布任务费用：</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.score_for_task"></el-switch>
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="$tools.checkAdminPower('system', 'share')" label="分享转发">
        <div class="form-item">
        <span class="form-label">标题：</span>
        <el-input v-model="form.share_title"></el-input>
        <span class="text-gray">分享小程序卡片的标题，建议保持在24个字内</span>
        </div>
        <div class="form-item">
        <span class="form-label">图片：</span>
        <el-upload
          drag
          :action="uploadUrl"
          :show-file-list="false"
          :on-success="handleImageSuccess"
          :on-error="handleError"
          :before-upload="beforeImageUpload"
          :data="qiniuData">
          <img v-if="form.share_image" :src="form.share_image | getQiniuFullUrl">
          <div v-else class="el-default">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或
              <em>点击上传</em>
            </div>
          </div>
          <div class="el-upload__tip" slot="tip">建议图片比例为5:4，只能上传jpg/png文件，且不超过5MB</div>
        </el-upload>
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="$tools.checkAdminPower('system', 'agreement')" label="平台协议">
        <div class="form-item">
          <span class="form-label">服务协议标题：</span>
          <el-input v-model="form.agreement_title"></el-input>
        </div>
        <div class="form-item">
          <span class="form-label">服务协议内容：</span>
          <el-input
            type="textarea"
            :rows="8"
            placeholder="请输入服务协议内容"
            v-model="form.agreement_content">
          </el-input>
        </div>
        <div class="form-item">
          <span class="form-label">隐私政策标题：</span>
          <el-input v-model="form.policy_title"></el-input>
        </div>
        <div class="form-item">
          <span class="form-label">隐私政策内容：</span>
          <el-input
            type="textarea"
            :rows="8"
            placeholder="请输入隐私政策内容"
            v-model="form.policy_content">
          </el-input>
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="$tools.checkAdminPower('system', 'update')" label="应用更新">
        <div class="form-item">
          <span class="form-label">应用版本号：</span>
          <el-input type="number" v-model="form.app_version" maxlength="4" max="9999"></el-input>
          <p class="text-gray">请输入100~9999之间的整数</p>
        </div>
        <div class="form-item">
          <span class="form-label">版本名称：</span>
          <el-input v-model="form.app_version_name"></el-input>
        </div>
        <div class="form-item">
          <span class="form-label">强制更新：</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.app_update_rule"></el-switch>
          <span class="text-gray">若开启，APP需更新到最新版才可使用</span>
        </div>
        <div class="form-item">
          <span class="form-label">更新说明：</span>
          <el-input
            type="textarea"
            autosize
            placeholder="请输入更新说明"
            v-model="form.app_update_description">
          </el-input>
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="$tools.checkAdminPower('system', 'pay')" label="支付设置">
        <div class="form-item">
          <span class="text-gray">若开启微信支付，请提供微信商户号和秘钥给开发者配置到程序中</span>
        </div>
        <div class="form-item">
          <span class="form-label">开启小程序微信支付：</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.online_pay"></el-switch>
        </div>
        <div class="form-item">
          <span class="form-label">开启APP微信支付：</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.use_apppay"></el-switch>
        </div>
        <div class="form-item">
          <span class="form-label">开启公众号网页微信支付：</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.use_publicpay"></el-switch>
        </div>
        <div class="form-item">
          <span class="form-label">开启APP支付宝支付：</span>
          <el-switch :active-value="1" :inactive-value="0" v-model="form.use_app_alipay"></el-switch>
        </div>
        <div class="form-item">
          <span class="text-gray">当关闭以上某一端的微信支付功能，那么这一端的付款页面则自动显示以下收款信息：</span>
        </div>
        <div class="form-item">
          <span class="form-label">支付宝收款码：</span>
          <el-upload
            drag
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAlipayCodeSuccess"
            :on-error="handleError"
            :before-upload="beforeImageUpload"
            :data="qiniuData">
            <img v-if="form.alipay_code" :src="form.alipay_code | getQiniuFullUrl">
            <div v-else class="el-default">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或
                <em>点击上传</em>
              </div>
            </div>
            <div class="el-upload__tip" slot="tip">请上传支付宝收款二维码</div>
          </el-upload>
        </div>
        <div class="form-item">
        <span class="form-label">微信收款码：</span>
        <el-upload
          drag
          :action="uploadUrl"
          :show-file-list="false"
          :on-success="handleWepayCodeSuccess"
          :on-error="handleError"
          :before-upload="beforeImageUpload"
          :data="qiniuData">
          <img v-if="form.wepay_code" :src="form.wepay_code | getQiniuFullUrl">
          <div v-else class="el-default">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或
              <em>点击上传</em>
            </div>
          </div>
          <div class="el-upload__tip" slot="tip">请上传微信收款二维码</div>
        </el-upload>
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="$tools.checkAdminPower('system', 'ad')" label="APP广告">
        <div class="form-item">
          <span class="form-label">立即领取按钮：</span>
          <el-input placeholder="请输入激励视频广告ID" v-model="form.grab_btn_ad"></el-input>
          <p class="text-gray">设置了之后，当用户点领取任务按钮时，需先看完激励视频。按钮位于任务详情</p>
        </div>
        <div class="form-item">
          <span class="form-label">提现按钮：</span>
          <el-input placeholder="请输入激励视频广告ID" v-model="form.withdraw_btn_ad"></el-input>
          <p class="text-gray">设置了之后，当用户提交提现申请时，需先看完激励视频。按钮位于提现页面</p>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="actions">
      <el-button size="medium" type="primary" @click="updateSetting">保存</el-button>
      <span class="text-gray">注意，此修改需要在下次启动或杀掉小程序重新进入才生效。</span>
    </div>
  </div>
</template>

<script>
import CommonProxy from '@/proxies/common';
import SystemProxy from '@/proxies/system';

export default {
  data() {
    return {
      tabPosition: 'left',
      form: {
        share_image: '',
      },
      qiniuData: {
        token: '',
      },
      // 七牛云上传储存区域的上传域名（华东、华北、华南、北美、东南亚）
      uploadUrl: window.API_CONFIG['qiniu_upload'],
    };
  },
  methods: {
    async getQiniuToken() {
      const res = await CommonProxy.getQiniuUploadToken();
      if (res.success) {
        this.qiniuData.token = res.data.uptoken;
      }
    },
    handleImageSuccess(res) {
      this.form.share_image = res.key;
    },
    handlePosterSuccess(res) {
      this.form.invite_poster = res.key;
    },
    handleAlipayCodeSuccess(res) {
      this.form.alipay_code = res.key;
    },
    handleWepayCodeSuccess(res) {
      this.form.wepay_code = res.key;
    },
    handleAndroidCodeSuccess(res) {
      this.form.android_download_code = res.key;
    },
    handleIOSCodeSuccess(res) {
      this.form.ios_download_code = res.key;
    },
    handleError() {
      this.$notify.error({
        title: '错误',
        message: '上传失败',
      });
    },
    beforeImageUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt5M = file.size / 1024 < 5120;
      let result = true;
      if (!isJPG && !isPNG) {
        this.$notify.error({
          title: '错误',
          message: '只能上传JPG/PNG格式的图片',
        });
        result = false;
      }
      if (!isLt5M) {
        this.$notify.error({
          title: '错误',
          message: '图片大小不能超过5mb',
        });
        result = false;
      }
      return result;
    },
    async getSetting() {
      const res = await SystemProxy.get();
      if (!res.fail) {
        this.form = res.data;
      }
    },
    async updateSetting() {
      const res = await SystemProxy.update(this.form);
      if (!res.fail) {
        this.$notify.success({
          title: '成功',
          message: '保存成功',
        });
      }
    },
  },
  created() {
    this.getSetting();
    this.getQiniuToken();
  },
};
</script>

<style lang="scss">
.system-page {
  padding: 40px!important;
  .form-item {
    margin-top: 20px;
    margin-left: 40px;
    max-width: 600px;
    &:first-child {
      margin-top: 0;
    }
    .poster {
      .el-upload,.el-upload-dragger {
        width:200px;
        height:354px;
      }
    }
  }
  .form-label {
    margin-bottom: 5px;
    display: inline-block;
  }
  .actions {
    margin: 40px 140px;
  }
  .el-upload-dragger {
    width: 200px;
    height: 160px;
  }
  img {
    max-width: 100%;
  }
  .text-gray {
    color: $color-light-gray;
    font-size: 12px;
    line-height: 20px;
    margin-top: 10px;
  }
  .text-blue {
    color: $color-primary;
  }
  .el-tabs__item {
    font-weight: 400;
    color: #909399;
    &:hover {
      color: #333;
    }
    &.is-active {
      background-color: #f4f5f5;
      color: #333;
    }
  }
}
</style>

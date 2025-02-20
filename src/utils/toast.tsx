import { toast } from 'react-toastify'

import { capitalize } from 'lodash'

import { Image } from '@/components/Image'

import ErrorIcon from '@/assets/img/icon/ic-modal-error.svg'
import SuccessIcon from '@/assets/img/icon/ic-modal-success.svg'

export function showToast(content: any) {
  toast(content, {
    className: 'common-toast',
    hideProgressBar: true,
    icon: false,
    closeButton: false,
    onClick: () => {
      toast.dismiss()
    }
  })
}

export function createTxToast(type: string, message: string, $t: any) {
  let result = <div className="snotify-tx"></div>

  if (type === 'confirm') {
    result = (
      <div className="snotify-tx">
        <p>{$t('General.Progressing')}</p>
        <p>
          <div className="snotify-wave-dot">
            <p className="dot"></p>
            <p className="dot"></p>
            <p className="dot"></p>
          </div>
        </p>
      </div>
    )
  }

  if (type === 'success' || type === 'login') {
    result = (
      <div className="snotify-tx">
        <p>
          {type === 'success'
            ? $t('General.Success')
            : $t('General.LoginSuccess')}
        </p>
        <p>
          <Image src={SuccessIcon} />
        </p>
      </div>
    )
  }

  if (type === 'fail' || type === 'cancel') {
    result = (
      <div className="snotify-tx">
        <p>{$t(`General.${capitalize(type)}`)}</p>
        <p>
          <Image src={ErrorIcon} />
        </p>
      </div>
    )
  }

  if (type === 'error') {
    result = (
      <div className="snotify-tx ltr">
        <p>{message}</p>
        <p>
          <Image src={ErrorIcon} />
        </p>
      </div>
    )
  }

  if (type === 'error') {
    result = (
      <div className="snotify-tx ltr">
        <p>{message}</p>
        <p>
          <Image src={ErrorIcon} />
        </p>
      </div>
    )
  }

  return result
}
